import { Command } from "obsidian";
import { AM } from "src/app/AppManager";
import { getFmCache } from "src/assistance/aliaseFn/frontmatter";
import { isDailyNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { FmForcedEditableModal } from "src/looks/modals/FmForcedEditableModal";
import { FSuggestModal } from "src/looks/modals/FSuggestModal";
import { openModalMainMenu } from "src/looks/modals/SimpleDisplayModal";

const CommandScript = {
    createMyNote: async () => {
        AM.useCase.prompt.createMyNote();
    },
    createLogNote: async () => {
        AM.useCase.prompt.createLogNote();
    },
    openMainMenu: () => {
        openModalMainMenu();
    },
    forcedUpdateMetadata: () => {
        const orb = AM.orb.getActiveStdNoteOrb();
        if (!orb) return;
        FmForcedEditableModal.openNew(orb.viewer);
    },
    execGeminiTodayClosingEvaluation: async () => {
        const ym = AM.diary.getToday("Y-m").split("-");
        const y = Number(ym[0]);
        const m = Number(ym[1]);
        const dailyNoteId = await AM.useCase.prompt.selectFromList(
            [
                ...AM.tFile.getDailyTFilesByMonth(y, m),
                ...AM.tFile.getDailyTFilesByMonth(y, m - 1)
            ].map(t => {
                const fm = getFmCache(t)!;
                return fm["id"];
            })
        );
        const dailyOrb = AM.orb.getDiaryNoteOrb({ noteId: dailyNoteId });
        if (!isDailyNoteOrb(dailyOrb)) throw new UnexpectedError();

        alert(`geminiにリクエストを送ります。回答が得られるまで時間がかかります。${dailyOrb.note.baseName}に本日の総評が書き込まれます。`);
        await AM.useCase.noteModifier.appendGeminiTodayClosingEvaluation(dailyOrb);
        alert(`geminiからレスポンスを受け取りました。${dailyOrb.note.baseName}に本日の総評が書き込まれました。`);
    },
    softDeleteNote: () => {
        const tFile = AM.tFile.activeTFile;
        if (!tFile) return;
        AM.useCase.noteSoftDeleter.trashNote(tFile);
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types
function makeCommands(scripts: Record<string, Function>): Record<string, { isEnabled: boolean, command: Command }> {
    const result: Record<string, { isEnabled: boolean, command: Command }> = {};

    Object.entries(scripts).forEach(([key, fn]) => {
        // key を "testXxx" 形式に変換
        const id = `orbiz-command-${key.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}`;
        const commandName = key;

        const command: Command = {
            id,
            name: commandName,
            callback: async () => {
                await fn();
            }
        };

        result[`${key[0].toUpperCase()}${key.slice(1)}`] = {
            isEnabled: true,
            command
        };
    });

    return result;
}
const COMMANDS = makeCommands(CommandScript);

export const COMMAND_SELECT_ORBIZ: Command = {
    id: "select-orbiz-commands",
    name: "selectOrbizCommands",
    callback: async () => {
        const name = await FSuggestModal.getSelectedItem(
            Object.keys(COMMANDS)
        );

        const func = COMMANDS[name].command.callback;
        if (func === undefined) {
            alert("想定外のエラー");
            return;
        }

        func();
    }
}