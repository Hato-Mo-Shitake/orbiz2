import MyPlugin from "main";
import { MetadataCache } from "obsidian";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { CacheChangedHandler } from "../handlers/metadataCache";

export class MetadataCacheEventWatcher {
    private get _myPlugin(): MyPlugin {
        return OAM().myPlugin;
    }
    private get _metadataCache(): MetadataCache {
        return OAM().app.metadataCache;
    }

    public watchOnCacheChanged(callback: CacheChangedHandler) {
        this._myPlugin.registerEvent(this._metadataCache.on("changed", callback));
    }
}

