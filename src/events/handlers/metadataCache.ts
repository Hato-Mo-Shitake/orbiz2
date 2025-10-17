import { CachedMetadata, TFile } from "obsidian";
import { AM } from "src/app/AppManager";

type EventHandlerForMetadataCacheMap = {
    changed: (file: TFile, data: string, cache: CachedMetadata) => any,
}
export type EventHandlerForMetadataCache<K extends keyof EventHandlerForMetadataCacheMap> = EventHandlerForMetadataCacheMap[K];

/*-------------------------------*/

const handleUpdateCacheWhenMetadataChanged: EventHandlerForMetadataCache<"changed"> = (file: TFile, data: string, cache: CachedMetadata) => {
    AM.cache.updateCacheWhenMetadataChanged(file, cache);
}

/*-------------------------------*/

const handleListCacheChanged: EventHandlerForMetadataCache<"changed">[] = [
    handleUpdateCacheWhenMetadataChanged
];

/*-------------------------------*/

export const EventHandlersForMetadataCache = {
    "changed": handleListCacheChanged,
}