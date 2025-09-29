import { TAbstractFile, TFile } from "obsidian";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";

export type TAbstractFileRenameHandler = (file: TAbstractFile, oldPath: string) => any;
export type TAbstractFileDeleteHandler = (file: TAbstractFile) => any;

export const handleUpdateCacheWhenPathChanged: TAbstractFileRenameHandler = (file: TAbstractFile, oldPath: string) => {
    if (!(file instanceof TFile)) return;
    OCM().updateCacheWhenPathChanged(file, oldPath);
}

export const handleListTAbstractFileRename: TAbstractFileRenameHandler[] = [
    handleUpdateCacheWhenPathChanged
];