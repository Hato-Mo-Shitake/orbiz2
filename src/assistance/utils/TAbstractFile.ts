import { TFile, TFolder, Vault } from "obsidian";

export function getAllTFilesInFolder(folder: TFolder): TFile[] {
    const files: TFile[] = [];
    Vault.recurseChildren(folder, t => {
        if (t instanceof TFile) {
            files.push(t);
        }
    })
    return files;
}

export function getAllTFoldersInFolder(folder: TFolder): TFolder[] {
    const folders: TFolder[] = [];
    Vault.recurseChildren(folder, t => {
        if (t instanceof TFolder) {
            folders.push(t);
        }
    })
    return folders;
}