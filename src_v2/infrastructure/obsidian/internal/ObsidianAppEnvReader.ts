import { Plugin } from "obsidian";
import { IAppEnvReader } from "../app/IAppEnvReader";
import { getEnvData } from "./obsidian-file.utils";

export class ObsidianAppEnvReader implements IAppEnvReader {
    constructor(
        private readonly _plugin: Plugin
    ) {
    }

    async getActiveSpaceName(): Promise<string> {
        const data = await getEnvData(this._plugin);
        const prefix = data["activeSpace"];
        const spaceName = String.isString(prefix) ? `${prefix}-space` : `my-space`;
        return spaceName;
    }
}