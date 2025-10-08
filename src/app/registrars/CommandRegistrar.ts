import { Command } from "obsidian";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { COMMAND_LIST_INI_EXAMPLE } from "../commands/example/ini-example";
import { COMMAND_SELECT_TEST } from "../commands/test/test";

export class CommandRegister {
    private readonly commands: Command[] = [];

    constructor() {
        this._add(COMMAND_SELECT_TEST);
        this._addList(COMMAND_LIST_INI_EXAMPLE);
    }

    private _add(command: Command): void {
        this.commands.push(command);
    }

    private _addList(commandList: Command[]): void {
        this.commands.push(...commandList);
    }

    register(): void {
        const { myPlugin } = OAM();
        this.commands.forEach(command => {
            myPlugin.addCommand(command);
        });
    }
}