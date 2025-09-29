import MyPlugin from "main";
import { App, Workspace } from "obsidian";
import { OEM } from "./OrbizErrorManager";

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

    private readonly _isProd: boolean;
    private readonly MAIN_ROOT = "my-space";
    private readonly TEST_ROOT = "test-space"

    private constructor(
        private readonly _app: App,
        private readonly _myPlugin: MyPlugin,
    ) {
        this._isProd = false;
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

    get isProd(): boolean {
        return this._isProd;
    }

    get rootPath(): string {
        if (this.isProd) {
            return this.MAIN_ROOT;
        } else {
            return this.TEST_ROOT;
        }
    }
    get rootDir(): string {
        return this.rootPath + "/";
    }

    isVaultPath(input: string, ext: string = ".md"): boolean {
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