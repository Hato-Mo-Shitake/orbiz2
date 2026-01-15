import { Plugin } from "obsidian";
import { AppEnvRules } from "../../app/AppEnvRules";
import { getObsidianEnvData } from "./obsidian-markdown-file.helpers";


export class ObsidianAppEnvRules implements AppEnvRules {
    private _activeSpaceName: string | null = null;
    private _myFolderPath: string | null = null;
    private _logFolderPath: string | null = null;

    constructor(
        private readonly _plugin: Plugin
    ) {
    }

    async initialize(): Promise<void> {
        const data = await getObsidianEnvData(this._plugin);

        const spaceNamePrefix = data["activeSpace"];
        const spaceName = String.isString(spaceNamePrefix) ? `${spaceNamePrefix}-space` : `my-space`;
        this._activeSpaceName = spaceName;

        this._myFolderPath = `${spaceName}/galaxies`;
        this._logFolderPath = `${spaceName}/logs`;
    }

    get activeSpaceName(): string {
        if (this._activeSpaceName === null) {
            throw new Error("Uninitialized ObsidianAppEnvRules");
        }

        return this._activeSpaceName;
    }

    get myFolderPath(): string {
        if (this._myFolderPath === null) {
            throw new Error("Uninitialized ObsidianAppEnvRules");
        }

        return this._myFolderPath;
    }

    get logFolderPath(): string {
        if (this._logFolderPath === null) {
            throw new Error("Uninitialized ObsidianAppEnvRules");
        }

        return this._logFolderPath;
    }

    isStdFilePath(path: string): boolean {
        return [
            this.myFolderPath + "/",
            this.logFolderPath + "/",
        ].some(StdNotePath =>
            path.startsWith(StdNotePath)
        )
    }
}