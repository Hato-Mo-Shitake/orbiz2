import { COMMAND_SELECT_ORBIZ } from "src/commands/commands";
import { COMMAND_LIST_INI_EXAMPLE } from "../../commands/example/ini-example";
import { COMMAND_SELECT_TEST } from "../../commands/test/test";
import { AM } from "../AppManager";

export class CommandRegister {
    register(): void {
        const { plugin } = AM.orbiz;

        [
            COMMAND_SELECT_TEST,
            COMMAND_SELECT_ORBIZ,
            ...COMMAND_LIST_INI_EXAMPLE,
        ].forEach(command => {
            plugin.addCommand(command);
        });
    }
}