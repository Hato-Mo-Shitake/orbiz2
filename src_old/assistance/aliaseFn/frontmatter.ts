import { FrontMatterCache, TFile } from "obsidian";
import { AM } from "src/app/AppManager";

export function getFmCache(tFile: TFile): FrontMatterCache | null {
    return AM.obsidian.metadataCache.getFileCache(tFile)?.frontmatter || null;
}