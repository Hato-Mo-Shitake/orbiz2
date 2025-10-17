import OrbizPlugin from "main";
import { NotInitializedError } from "src/errors/NotInitializedError";
import { AM } from "../AppManager";

export class OrbizManager {
    private static _instance: OrbizManager | null = null;

    static setInstance(plugin: OrbizPlugin): void {
        this._instance = new OrbizManager(plugin);
    }

    static getInstance(): OrbizManager {
        if (!this._instance) throw new NotInitializedError();
        return this._instance;
    }

    /** ------------ */

    private readonly _myRoot = "my-space";
    private readonly _testRoot = "test-space"

    private constructor(
        private readonly _plugin: OrbizPlugin,
    ) { }

    get plugin(): OrbizPlugin {
        return this._plugin;
    }

    get rootPath(): string {
        const spaceType = AM.orbizSetting.spaceType;
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

        // if (parts[0] + "/" != OAM().rootDir) {
        //     return false;
        // }
        if (parts[0] + "/" != AM.orbiz.rootDir) {
            return false;
        }

        // 拡張子チェック
        if (!input.endsWith(ext)) {
            return false;
        }

        return true;
    }
}
