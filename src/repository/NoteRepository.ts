import { DataWriteOptions, TFile, TFolder } from "obsidian";
import { AM } from "src/app/AppManager";
import { createDailyNotePath, createLogNotePath, createMyNotePath, getParentPath } from "src/assistance/utils/path";
import { DuplicateStdNoteNameExistError } from "src/errors/DuplicateStdNoteNameExistError";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { BaseFm } from "src/orbits/schema/frontmatters/fm";
import { FmValue } from "src/orbits/schema/frontmatters/FmKey";
import { isLogNoteType, isMyNoteType, SubNoteType } from "src/orbits/schema/frontmatters/NoteType";

export class NoteRepository {
    private get fileManager() {
        return AM.obsidian.fileManager;
        // return OAM().app.fileManager;
    }
    private get vault() {
        return AM.obsidian.vault;
        // return OAM().app.vault;
    }

    async deleteAndUpsertFmAttrs(tFile: TFile, deletedFm: Record<string, FmValue>, newFm: Record<string, FmValue>) {
        await this.fileManager.processFrontMatter(tFile, fm => {
            // console.log("deleteAndUpsertFmAttrs");
            Object.entries(deletedFm).forEach(([key, val]) => {
                delete fm[key];
            });
            Object.entries(newFm).forEach(([key, val]) => {
                fm[key] = val;
            });
        });
    }

    async updateFmAttr(tFile: TFile, key: string, newValue: any): Promise<void> {
        console.log("updateFmAttr", tFile, key, newValue);
        await this.fileManager.processFrontMatter(tFile, fm => {
            fm[key] = newValue;
        });
    }

    async updateFmAttrs(tFile: TFile, newFm: BaseFm): Promise<void> {
        console.log("updateFmAttrs", tFile, newFm);
        await this.fileManager.processFrontMatter(tFile, fm => {
            Object.entries(newFm).forEach(([key, value]) => {
                fm[key] = value;
            });
        });
    }

    async deleteFmAttrs(tFile: TFile, attrs: Record<string, FmValue>): Promise<void> {
        await this.fileManager.processFrontMatter(tFile, fm => {
            Object.entries(attrs).forEach(([key, val]) => {
                delete fm[key];
            });
        })
    }
    async upsertFmAttrs(tFile: TFile, attrs: Record<string, FmValue>): Promise<void> {
        await this.fileManager.processFrontMatter(tFile, fm => {
            Object.entries(attrs).forEach(([key, val]) => {
                fm[key] = val;
            });
        })
    }

    async renameTFile(tFile: TFile, newName: string) {
        try {
            const pPath = getParentPath(tFile.path);
            const newPath = pPath + "/" + newName + ".md";
            await this.fileManager.renameFile(tFile, newPath);
            // await OAM().app.fileManager.renameFile(tFile, newPath);
        } catch {
            throw new UnexpectedError();
        }

        return newName;
    }

    async changeTFileDir(tFile: TFile, newDirPath: string, options?: { newFileName?: string }): Promise<string> {
        const tFolder = await this.getOrCreateTFolder(newDirPath);
        const newPath = `${tFolder.path}/${options?.newFileName || tFile.name}`

        try {
            // await OAM().app.vault.rename(tFile, newPath);
            // await OAM().app.fileManager.renameFile(tFile, newPath);
            await this.fileManager.renameFile(tFile, newPath);

            // await OAM().app.fileManager.renameFile(tFile, "test-space/logs/@かに.md");
        } catch {
            throw new UnexpectedError();
        }

        return newPath;
    }

    async changeTFilePath(tFile: TFile, newPath: string): Promise<string> {
        await this.getOrCreateTFolder(getParentPath(newPath));
        try {
            // await OAM().app.fileManager.renameFile(tFile, newPath);
            await this.fileManager.renameFile(tFile, newPath);
        } catch (e) {
            console.error(e);
            throw new UnexpectedError();
        }

        return newPath;
    }

    async createStdTFile(baseName: string, subType: SubNoteType, data = "", options?: DataWriteOptions): Promise<TFile> {
        // const existingId = AM.cache.getStdNoteIdByName(baseName);
        const existingId = AM.cache.getStdNoteIdByName(baseName);
        if (existingId) {
            const orb = AM.orb.getStdNoteOrb({ noteId: existingId });
            if (!orb) throw new UnexpectedError();
            throw new DuplicateStdNoteNameExistError(orb);
        }

        let path: string;
        if (isMyNoteType(subType)) {
            path = createMyNotePath(baseName, subType);
        } else if (isLogNoteType(subType)) {
            path = createLogNotePath(baseName, subType);
        } else {
            throw new UnexpectedError();
        }

        // const path = createStdNotePath(baseName, subType);

        const folderPath = getParentPath(path);
        await this.getOrCreateTFolder(folderPath);

        return this.vault.create(path, data, options);
    }

    async createDailyTFile(date?: Date, data = "", options?: DataWriteOptions): Promise<TFile> {
        const path = createDailyNotePath(date);
        const folderPath = getParentPath(path);
        await this.getOrCreateTFolder(folderPath);

        return this.vault.create(path, data, options);
    }

    async getOrCreateTFolder(path: string): Promise<TFolder> {
        const existing = this.vault.getAbstractFileByPath(path);

        if (existing instanceof TFolder) {
            return existing;
        } else if (existing) {
            throw new Error(`"${path}" はすでにファイルとして存在しています`);
        }

        const parentPath = getParentPath(path);
        if (parentPath && parentPath !== path) {
            await this.getOrCreateTFolder(parentPath);
        }
        return this.vault.createFolder(path);
    }
}