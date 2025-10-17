import { Command } from "obsidian";
import { AM } from "src/app/AppManager";
import { getRandomFromArray } from "src/assistance/utils/array";
import { generateCurrentIsoDatetime } from "src/assistance/utils/date";
import { debugConsole } from "src/assistance/utils/debug";
import { sanitizeFileName } from "src/assistance/utils/filter";
import { FmDisplayModal } from "src/looks/modals/FmDisplayModal";
import { FmEditableModal } from "src/looks/modals/FmEditableModal";
import { FSuggestModal } from "src/looks/modals/FSuggestModal";
import { openModalMainMenu } from "src/looks/modals/SimpleDisplayModal";
import { VIEW_TYPE_EXAMPLE } from "src/looks/views/ExampleView";
import { logNoteTypeList, LogNoteTypeZEnum, myNoteTypeList, MyNoteTypeZEnum } from "src/orbits/schema/frontmatters/NoteType";
import { logNoteStatusList, LogNoteStatusZEnum } from "src/orbits/schema/frontmatters/Status";

const TestScript = {
    check: () => {
        debugConsole(
            AM.obsidian.app
        );
        debugConsole(
            AM.noteHistory.latestId
        );
    },
    checkNoteSource: () => {
        // @ts-ignore NOTE: テスト用
        const sources = AM.cache._noteSourceMapById;
        console.log("note sources: ", sources);
    },
    checkCachedStdNoteOrbs: () => {
        console.log(
            // @ts-ignore NOTE: テスト用
            AM.cache._stdNoteOrbMapById
        );
    },
    checkTodayRecordNoteIds: () => {
        console.log("todayRecordNoteIds: ", AM.diary.todayRecordNoteIds);
    },
    checkSettings: () => {
        // @ts-ignore NOTE: テスト用
        console.log(AM.orbizSetting._settings);
    },
    checkNoteIdHistory() {
        debugConsole(AM.noteHistory.getAllDesc());
        // console.log(ONhistoryM().getAllDesc());
    },
    setTagsAndInLinks: () => {
        const tFile = AM.tFile.activeTFile;
        if (!tFile) return;
        // const orb = AM.orb.getStdNoteOrb({ tFile });
        const orb = AM.orb.getStdNoteOrb({ tFile });
        if (!orb) return;
        orb.store.getState().setFmAttrTags(["かに", "せみ"]);
        orb.store.getState().setInLinkIds(["1", "2"]);
        // いけてそう！！！
    },
    openExampleView: async () => {
        AM.useCase.viewActivator.openNewView(VIEW_TYPE_EXAMPLE);
    },
    openCategoriesSetting: async () => {
        // CategoriesSettingModal.open();
    },

    openNoteSearchlight: async () => {
        // NoteSearchlightModal.open();
        // AM.useCase.viewActivator.openNewView(VIEW_TYPE_NOTE_SEARCHLIGHT);
    },
    openMainMenu: async () => {
        debugConsole("成功！2");
        openModalMainMenu();
        // SimpleDisplayModal.open(
        //     createMainMenuForModal
        // );
        // MainMenuModal.open();

        // AM.useCase.viewActivator.openNewView("main-menu-view");
    },
    openFmEditableModal: () => {
        const noteOrb = AM.orb.getActiveStdNoteOrb();
        if (!noteOrb) return;
        FmEditableModal.openNew(noteOrb.viewer);
    },
    openFmDisplayModal: () => {
        const noteOrb = AM.orb.getActiveStdNoteOrb();
        if (!noteOrb) return;
        FmDisplayModal.openNew(noteOrb.viewer);
    },
    openTodayNote: () => {
        const orb = AM.diary.todayNoteOrb;
        AM.looks.openNote(orb.note, false);
    },
    createDailyNote: () => {
        AM.useCase.noteCreator.createDailyNote();
    },
    createAutoStdNoteMany: async () => {
        const myList: string[] = [
            ...myNoteTypeList
        ];

        const logSubTypeList: string[] = [
            ...logNoteTypeList
        ];
        const statusList: string[] = [
            ...logNoteStatusList
        ];
        for (let i = 0; i < 10; i++) {
            const mySubType = getRandomFromArray(myList);
            await AM.useCase.noteCreator.createMyNote({
                baseName: sanitizeFileName(generateCurrentIsoDatetime() + "my" + i),
                subType: MyNoteTypeZEnum.parse(mySubType)
            });

            const logSubType = getRandomFromArray(logSubTypeList);
            const status = getRandomFromArray(statusList);
            await AM.useCase.noteCreator.createLogNote({
                baseName: sanitizeFileName(generateCurrentIsoDatetime() + "log" + + i),
                subType: LogNoteTypeZEnum.parse(logSubType),
                status: LogNoteStatusZEnum.parse(status)
            });
        }
    },
    createAutoMyNote: async () => {
        const list: string[] = [
            ...myNoteTypeList
        ];
        const subType = getRandomFromArray(list);
        await AM.useCase.noteCreator.createMyNote({
            baseName: sanitizeFileName(generateCurrentIsoDatetime()),
            subType: MyNoteTypeZEnum.parse(subType)
        });
        // AM.looks.openNote(orb.note, "split");
    },
    createAutoLogNote: async () => {
        const subTypeList: string[] = [
            ...logNoteTypeList
        ];
        const subType = getRandomFromArray(subTypeList);

        const statusList: string[] = [
            ...logNoteStatusList
        ];
        const status = getRandomFromArray(statusList);

        await AM.useCase.noteCreator.createLogNote({
            baseName: sanitizeFileName(generateCurrentIsoDatetime()),
            subType: LogNoteTypeZEnum.parse(subType),
            status: LogNoteStatusZEnum.parse(status)
        });
        // AM.looks.openNote(orb.note, "split");
    },
    softDeleteNote: () => {
        const tFile = AM.tFile.activeTFile;
        if (!tFile) return;
        AM.useCase.noteSoftDeleter.trashNote(tFile);
    },
    createMyNote: async () => {
        AM.useCase.prompt.createMyNote();
    },
    createLogNote: async () => {
        AM.useCase.prompt.createLogNote();
    },
    saveProgress: async () => {
        // OAM().OrbizPlugin.saveProgress();
        // AM.obsidian.OrbizPlugin.saveProgress();
        AM.orbiz.plugin.saveProgress();
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types
function makeTestCommands(scripts: Record<string, Function>): Record<string, { isEnabled: boolean, command: Command }> {
    const result: Record<string, { isEnabled: boolean, command: Command }> = {};

    Object.entries(scripts).forEach(([key, fn]) => {
        // key を "testXxx" 形式に変換
        const id = `test-${key.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}`;
        const commandName = key;

        const command: Command = {
            id,
            name: commandName,
            callback: async () => {
                await fn();
            }
        };

        result[`test${key[0].toUpperCase()}${key.slice(1)}`] = {
            isEnabled: true,
            command
        };
    });

    return result;
}
const TEST_COMMANDS = makeTestCommands(TestScript);

export const COMMAND_SELECT_TEST: Command = {
    id: "select-test-commands",
    name: "selectTestCommands",
    callback: async () => {
        const name = await FSuggestModal.getSelectedItem(
            Object.keys(TEST_COMMANDS)
        );

        const func = TEST_COMMANDS[name].command.callback;
        if (func === undefined) {
            alert("想定外のエラー");
            return;
        }

        func();
    }
}