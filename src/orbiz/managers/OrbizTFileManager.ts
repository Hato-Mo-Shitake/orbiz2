import { App, FrontMatterCache, TFile } from "obsidian";
import { getAllTFilesInFolder } from "src/assistance/utils/TAbstractFile";
import { extractLinkTarget } from "src/assistance/utils/filter";
import { LogNoteType, MyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { OAM } from "./OrbizAppManager";
import { OCM } from "./OrbizCacheManager";
import { ODM } from "./OrbizDiaryManager";
import { OEM } from "./OrbizErrorManager";

export class OrbizTFileManager {
    private static _instance: OrbizTFileManager | null = null;

    static setInstance(): void {
        this._instance = new OrbizTFileManager(
        );
    }

    static getInstance(): OrbizTFileManager {
        if (!this._instance) OEM.throwNotInitializedError(OrbizTFileManager);

        return this._instance;
    }

    /** ------------ */
    private constructor(
    ) { }

    private get app(): App {
        return OAM().app
    }

    get activeTFile(): TFile | null {
        const { app } = OAM();
        const tFile = app.workspace.getActiveFile();
        if (!tFile) return null;
        return tFile;
    }
    get allStdTFiles(): TFile[] {
        return this.allMyTFiles.concat(this.allLogTFiles);
    }
    get allMyTFiles(): TFile[] {
        const folderPath = `${OAM().rootPath}/galaxies`;
        const folder = OAM().app.vault.getFolderByPath(folderPath);
        if (!folder) OEM.throwUnexpectedError();
        return getAllTFilesInFolder(folder);
    }
    getAllMyTFilesForSubType(subType: MyNoteType): TFile[] {
        const folderPath = `${OAM().rootPath}/galaxies/${subType}`;
        const folder = OAM().app.vault.getFolderByPath(folderPath);
        if (!folder) OEM.throwUnexpectedError();
        return getAllTFilesInFolder(folder);
    }
    get allLogTFiles(): TFile[] {
        const folderPath = `${OAM().rootPath}/logs`;
        const folder = OAM().app.vault.getFolderByPath(folderPath);
        if (!folder) OEM.throwUnexpectedError();
        return getAllTFilesInFolder(folder);
    }
    getAllLogTFilesForSubType(subType: LogNoteType): TFile[] {
        const folderPath = `${OAM().rootPath}/logs/${subType}`;
        const folder = OAM().app.vault.getFolderByPath(folderPath);
        if (!folder) OEM.throwUnexpectedError();
        return getAllTFilesInFolder(folder);
    }


    getDailyTFilesByMonth(y: number, m: number): TFile[] {
        const folderPath = `${OAM().rootPath}/diaries/daily/${y}/${String(m).padStart(2, "0")}`;
        const folder = OAM().app.vault.getFolderByPath(folderPath);
        if (!folder) OEM.throwUnexpectedError();
        return getAllTFilesInFolder(folder);
    }

    isStdTFilePath(path: string) {
        const rootDir = OAM().rootPath + "/";
        return [
            rootDir + "galaxies",
            rootDir + "logs",
        ].some(StdNotePath =>
            path.startsWith(StdNotePath)
        )
    }
    isMyTFilePath(path: string): boolean {
        const rootDir = OAM().rootPath + "/";
        return path.startsWith(rootDir + "galaxies");
    }
    isLogTFilePath(path: string) {
        const rootDir = OAM().rootPath + "/";
        return path.startsWith(rootDir + "logs");
    }
    isDiaryTFilePath(path: string) {
        const rootDir = OAM().rootDir;
        return path.startsWith(rootDir + "diaries");
    }

    getTFileByPath(path: string): TFile | null {
        const tFile = OAM().app.vault.getFileByPath(path);
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
            path = ODM().getDiaryNotePath(id);
        } else {
            path = OCM().getStdNoteSourceById(id)?.path;
        }

        if (!path) return null;

        return this.getMdTFileByPath(path);
    }
    // stringはid
    getDailyNoteTFile(src: string | Date): TFile | null {
        const path = ODM().getDailyNotePath(src);
        if (!path) return null;

        const tFile = OTM().getMdTFileByPath(path);
        if (!tFile) return null;
        return tFile;
    }

    getMdTFileByInternalLink(link: string): TFile | null {
        const path = extractLinkTarget(link);
        if (!path) return null;
        return this.getMdTFileByPath(path);
    }
    getNoteTFileByNoteName(noteName: string): TFile | null {
        const id = OCM().getStdNoteIdByName(noteName);
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

export const OTM = () => {
    return OrbizTFileManager.getInstance();
}