import OrbizPlugin from "main";
import { MetadataCache } from "obsidian";
import { AM } from "src/app/AppManager";
import { EventHandlerForMetadataCache } from "../handlers/metadataCache";

export class MetadataCacheEventWatcher {
    private get _orbizPlugin(): OrbizPlugin {
        return AM.orbiz.plugin;
    }
    private get _metadataCache(): MetadataCache {
        return AM.obsidian.metadataCache;
    }

    public watchOnCacheChanged(callback: EventHandlerForMetadataCache<"changed">) {
        this._orbizPlugin.registerEvent(this._metadataCache.on("changed", callback));
    }
}

