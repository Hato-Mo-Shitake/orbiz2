import { Command } from "obsidian";
import { getRandomFromArray } from "src/assistance/utils/array";
import { generateCurrentIsoDatetime } from "src/assistance/utils/date";
import { sanitizeFileName } from "src/assistance/utils/filter";
import { FmDisplayModal } from "src/looks/modals/FmDisplayModal";
import { FmEditableModal } from "src/looks/modals/FmEditableModal";
import { FSuggestModal } from "src/looks/modals/FSuggestModal";
import { MainMenuModal } from "src/looks/modals/menu/MainMenuModal";
import { NoteSearchlightModal } from "src/looks/modals/searchlights/NoteSearchlightModal";
import { CategoriesSettingModal } from "src/looks/modals/settings/CategoriesSettingModal";
import { VIEW_TYPE_EXAMPLE } from "src/looks/views/ExampleView";
import { logNoteTypeList, LogNoteTypeZEnum, myNoteTypeList, MyNoteTypeZEnum } from "src/orbits/schema/frontmatters/NoteType";
import { logNoteStatusList, LogNoteStatusZEnum } from "src/orbits/schema/frontmatters/Status";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { OOM } from "src/orbiz/managers/OrbizOrbManager";
import { OSM } from "src/orbiz/managers/OrbizSettingManager";
import { OTM } from "src/orbiz/managers/OrbizTFileManager";
import { OUM } from "src/orbiz/managers/OrbizUseCaseManager";
import { OVM } from "src/orbiz/managers/OrbizViewManager";

const TestScript = {
    checkNoteSource: () => {
        // @ts-ignore NOTE: テスト用
        const sources = OCM()._noteSourceMapById;
        console.log("note sources: ", sources);
    },
    checkCachedStdNoteOrbs: () => {
        console.log(
            // @ts-ignore NOTE: テスト用
            OCM()._stdNoteOrbMapById
        );
    },
    checkTodayRecordNoteIds: () => {
        console.log("todayRecordNoteIds: ", ODM().todayRecordNoteIds);
    },
    openExampleView: async () => {
        OUM().viewActivator.openNewView(VIEW_TYPE_EXAMPLE);
    },
    openCategoriesSetting: async () => {
        CategoriesSettingModal.open();
    },
    checkSettings: () => {
        // @ts-ignore NOTE: テスト用
        console.log(OSM()._settings);
    },
    openNoteSearchlight: async () => {
        NoteSearchlightModal.open();
        // OUM().viewActivator.openNewView(VIEW_TYPE_NOTE_SEARCHLIGHT);
    },
    openMainMenu: async () => {
        MainMenuModal.open();
        // OUM().viewActivator.openNewView("main-menu-view");
    },
    openFmEditableModal: () => {
        const noteOrb = OOM().getActiveStdNoteOrb();
        if (!noteOrb) return;
        FmEditableModal.openNew(noteOrb.viewer);
    },
    openFmDisplayModal: () => {
        const noteOrb = OOM().getActiveStdNoteOrb();
        if (!noteOrb) return;
        FmDisplayModal.openNew(noteOrb);
    },
    openTodayNote: () => {
        const orb = ODM().todayNoteOrb;
        OVM().openNote(orb.note, false);
    },
    createDailyNote: () => {
        OUM().noteCreator.createDailyNote();
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
            await OUM().noteCreator.createMyNote({
                baseName: sanitizeFileName(generateCurrentIsoDatetime() + "my" + i),
                subType: MyNoteTypeZEnum.parse(mySubType)
            });

            const logSubType = getRandomFromArray(logSubTypeList);
            const status = getRandomFromArray(statusList);
            await OUM().noteCreator.createLogNote({
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
        const orb = await OUM().noteCreator.createMyNote({
            baseName: sanitizeFileName(generateCurrentIsoDatetime()),
            subType: MyNoteTypeZEnum.parse(subType)
        });
        // OVM().openNote(orb.note, "split");
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

        const orb = await OUM().noteCreator.createLogNote({
            baseName: sanitizeFileName(generateCurrentIsoDatetime()),
            subType: LogNoteTypeZEnum.parse(subType),
            status: LogNoteStatusZEnum.parse(status)
        });
        // OVM().openNote(orb.note, "split");
    },
    softDeleteNote: () => {
        const tFile = OTM().activeTFile;
        if (!tFile) return;
        OUM().noteSoftDeleter.trashNote(tFile);
    },
    createMyNote: async () => {
        OUM().prompt.createMyNote();
    },
    createLogNote: async () => {
        OUM().prompt.createLogNote();
    },
    saveProgress: async () => {
        OAM().myPlugin.saveProgress();
    }
}

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