import { App, FileManager, MetadataCache, Vault, Workspace } from "obsidian";
import { NotInitializedError } from "src/errors/NotInitializedError";

export class ObsidianManager {
    private static _instance: ObsidianManager | null = null;

    static setInstance(
        app: App,
        // OrbizPlugin: OrbizPlugin
    ): void {
        this._instance = new ObsidianManager(
            app,
            // OrbizPlugin
        );
    }

    static getInstance(): ObsidianManager {
        if (!this._instance) throw new NotInitializedError();
        return this._instance;
    }

    /** ------------ */

    private constructor(
        private readonly _app: App,
        // private readonly _OrbizPlugin: OrbizPlugin,
    ) {
    }

    get app(): App {
        return this._app;
    }

    // get OrbizPlugin(): OrbizPlugin {
    //     return this._OrbizPlugin;
    // }

    get vault(): Vault {
        return this._app.vault;
    }

    get metadataCache(): MetadataCache {
        return this._app.metadataCache;
    }

    get workspace(): Workspace {
        return this.app.workspace;
    }

    get fileManager(): FileManager {
        return this.app.fileManager;
    }
}