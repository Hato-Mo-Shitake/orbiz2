import { Command } from "obsidian";
import { AM } from "src/app/AppManager";
import { FSuggestModal } from "src/looks/modals/FSuggestModal";

const CommandScript = {
    createMyNote: async () => {
        AM.useCase.prompt.createMyNote();
    },
    createLogNote: async () => {
        AM.useCase.prompt.createLogNote();
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