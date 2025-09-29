import { CachedMetadata, TFile } from "obsidian";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";

export type CacheChangedHandler = (file: TFile, data: string, cache: CachedMetadata) => any;

export const handleUpdateCacheWhenMetadataChanged: CacheChangedHandler = (file: TFile, data: string, cache: CachedMetadata) => {
    OCM().updateCacheWhenMetadataChanged(file, cache);
}

export const handleListCacheChanged: CacheChangedHandler[] = [
    handleUpdateCacheWhenMetadataChanged
];