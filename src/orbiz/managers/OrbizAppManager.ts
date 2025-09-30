import MyPlugin from "main";
import { App, Workspace } from "obsidian";
import { OEM } from "./OrbizErrorManager";
import { OSM } from "./OrbizSettingManager";

export class OrbizAppManager {
    private static _instance: OrbizAppManager | null = null;

    static setInstance(
        app: App,
        myPlugin: MyPlugin
    ): void {
        this._instance = new OrbizAppManager(
            app,
            myPlugin
        );
    }

    static getInstance(): OrbizAppManager {
        if (!this._instance) OEM.throwNotInitializedError(OrbizAppManager);

        return this._instance;
    }

    /** ------------ */

    private readonly _myRoot = "my-space";
    private readonly _testRoot = "test-space"

    private constructor(
        private readonly _app: App,
        private readonly _myPlugin: MyPlugin,
    ) {
    }

    get app(): App {
        return this._app;
    }

    get myPlugin(): MyPlugin {
        return this._myPlugin;
    }

    get ws(): Workspace {
        return this.app.workspace;
    }

    get rootPath(): string {
        const spaceType = OSM().spaceType;
        switch (spaceType) {
            case ("my"):
                return this._myRoot;
            case ("test"):
                return this._testRoot;
        }
    }
    get rootDir(): string {
        return this.rootPath + "/";
    }

    isVaultPath(input: string, ext = ".md"): boolean {
        if (input.startsWith("/")) return false;
        const parts = input.split("/");

        if (parts[0] + "/" != OAM().rootDir) {
            return false;
        }

        // 拡張子チェック
        if (!input.endsWith(ext)) {
            return false;
        }

        return true;
    }
}

export const OAM = () => {
    return OrbizAppManager.getInstance();
}