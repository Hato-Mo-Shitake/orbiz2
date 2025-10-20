import { App, FrontMatterCache, TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { getAllTFilesInFolder } from "src/assistance/utils/TAbstractFile";
import { extractLinkTarget } from "src/assistance/utils/filter";
import { NotInitializedError } from "src/errors/NotInitializedError";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { LogNoteType, MyNoteType } from "src/orbits/schema/frontmatters/NoteType";

export class TFileManager {
    private static _instance: TFileManager | null = null;

    static setInstance(): void {
        this._instance = new TFileManager(
        );
    }

    static getInstance(): TFileManager {
        if (!this._instance) throw new NotInitializedError();
        // OEM.throwNotInitializedError(OrbizTFileManager);

        return this._instance;
    }

    /** ------------ */
    private constructor(
    ) { }

    private get app(): App {
        return AM.obsidian.app;
        // return OAM().app
    }

    get activeTFile(): TFile | null {
        // const { app } = OAM();
        const tFile = this.app.workspace.getActiveFile();
        if (!tFile) return null;
        return tFile;
    }
    get allStdTFiles(): TFile[] {
        return this.allMyTFiles.concat(this.allLogTFiles);
    }
    get allMyTFiles(): TFile[] {
        const folderPath = `${AM.orbiz.rootPath}/galaxies`;
        // const folderPath = `${OAM().rootPath}/galaxies`;
        const folder = this.app.vault.getFolderByPath(folderPath);
        // const folder = OAM().app.vault.getFolderByPath(folderPath);
        if (!folder) throw new UnexpectedError();
        // throw new UnexpectedError();
        return getAllTFilesInFolder(folder);
    }
    getAllMyTFilesForSubType(subType: MyNoteType): TFile[] {
        const folderPath = `${AM.orbiz.rootPath}/galaxies/${subType}`;
        const folder = this.app.vault.getFolderByPath(folderPath);
        if (!folder) return [];
        return getAllTFilesInFolder(folder);
    }
    get allLogTFiles(): TFile[] {
        const folderPath = `${AM.orbiz.rootPath}/logs`;
        const folder = AM.obsidian.vault.getFolderByPath(folderPath);
        if (!folder) return [];
        return getAllTFilesInFolder(folder);
    }
    getAllLogTFilesForSubType(subType: LogNoteType): TFile[] {
        const folderPath = `${AM.orbiz.rootPath}/logs/${subType}`;
        // const folderPath = `${OAM().rootPath}/logs/${subType}`;
        const folder = AM.obsidian.vault.getFolderByPath(folderPath);
        // const folder = OAM().app.vault.getFolderByPath(folderPath);
        if (!folder) throw new UnexpectedError();
        // throw new UnexpectedError();
        return getAllTFilesInFolder(folder);
    }


    getDailyTFilesByMonth(y: number, m: number): TFile[] {
        // const folderPath = `${OAM().rootPath}/diaries/daily/${y}/${String(m).padStart(2, "0")}`;
        const folderPath = `${AM.orbiz.rootPath}/diaries/daily/${y}/${String(m).padStart(2, "0")}`;
        const folder = AM.obsidian.vault.getFolderByPath(folderPath);
        // const folder = OAM().app.vault.getFolderByPath(folderPath);
        if (!folder) throw new UnexpectedError();
        //  throw new UnexpectedError();
        return getAllTFilesInFolder(folder);
    }

    isStdTFilePath(path: string) {
        // const rootDir = OAM().rootPath + "/";
        const rootDir = AM.orbiz.rootPath + "/";
        return [
            rootDir + "galaxies",
            rootDir + "logs",
        ].some(StdNotePath =>
            path.startsWith(StdNotePath)
        )
    }
    isMyTFilePath(path: string): boolean {
        // const rootDir = OAM().rootPath + "/";
        const rootDir = AM.orbiz.rootPath + "/";
        return path.startsWith(rootDir + "galaxies");
    }
    isLogTFilePath(path: string) {
        // const rootDir = OAM().rootPath + "/";
        const rootDir = AM.orbiz.rootPath + "/";
        return path.startsWith(rootDir + "logs");
    }
    isDiaryTFilePath(path: string) {
        // const rootDir = OAM().rootDir;
        const rootDir = AM.orbiz.rootDir;
        return path.startsWith(rootDir + "diaries");
    }

    getTFileByPath(path: string): TFile | null {
        // const tFile = OAM().app.vault.getFileByPath(path);
        const tFile = AM.obsidian.vault.getFileByPath(path);
        if (!tFile) return null;
        return tFile;
    }

    getStdTFileByPath(path: string): TFile | null {
        if (!this.isStdTFilePath(path)) return null;
        return this.getTFileByPath(path);
    }

    getFmCacheByPath(path: string): FrontMatterCache | null {
        const tFile = this.getMdTFileByPath(path);
        if (!tFile) return null;
        const cache = this.app.metadataCache.getFileCache(tFile);
        return cache?.frontmatter || null;
    }

    getNoteTFileById(id: string): TFile | null {
        let path: string | undefined | null;

        if (id.startsWith("diary_")) {
            path = AM.diary.getDiaryNotePath(id);
        } else {
            // path = AM.cache.getStdNoteSourceById(id)?.path;
            path = AM.cache.getStdNoteSourceById(id)?.path;
        }

        if (!path) return null;

        return this.getMdTFileByPath(path);
    }
    // stringはid
    getDailyNoteTFile(src: string | Date): TFile | null {
        const path = AM.diary.getDailyNotePath(src);
        if (!path) return null;

        // const tFile = AM.tFile.getMdTFileByPath(path);
        const tFile = this.getMdTFileByPath(path);
        if (!tFile) return null;
        return tFile;
    }

    getMdTFileByInternalLink(link: string): TFile | null {
        const path = extractLinkTarget(link);
        if (!path) return null;
        return this.getMdTFileByPath(path);
    }
    getNoteTFileByNoteName(noteName: string): TFile | null {
        // const id = AM.cache.getStdNoteIdByName(noteName);
        const id = AM.cache.getStdNoteIdByName(noteName);
        if (!id) return null;
        return this.getNoteTFileById(id);
    }
    getMdTFileByPath(path: string): TFile | null {
        const tFile = this.app.vault.getFileByPath(path);
        if (!tFile) return null;
        if (tFile.extension !== "md") return null
        return tFile;
    }
}