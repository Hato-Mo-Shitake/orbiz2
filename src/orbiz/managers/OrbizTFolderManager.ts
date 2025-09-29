import { App } from "obsidian";
import { OAM } from "./OrbizAppManager";
import { OEM } from "./OrbizErrorManager";

export class OrbizTFolderManager {
    private static _instance: OrbizTFolderManager | null = null;

    static setInstance(): void {
        this._instance = new OrbizTFolderManager(
        );
    }

    static getInstance(): OrbizTFolderManager {
        if (!this._instance) OEM.throwNotInitializedError(OrbizTFolderManager);

        return this._instance;
    }

    /** ------------ */
    private constructor(
    ) { }

    private get app(): App {
        return OAM().app
    }
}

export const OTfolderM = () => {
    return OrbizTFolderManager.getInstance();
}