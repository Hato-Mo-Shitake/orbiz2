import { App, FrontMatterCache, TFile } from "obsidian";
import { extractLinkTarget } from "src/assistance/utils/filter";
import { isMyNote, MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { OAM } from "./OrbizAppManager";
import { OCM } from "./OrbizCacheManager";
import { OEM } from "./OrbizErrorManager";
import { OFM } from "./OrbizFactoryManager";
import { OTM } from "./OrbizTFileManager";

export class OrbizNoteManager {
    private static _instance: OrbizNoteManager | null = null;

    static setInstance(): void {
        this._instance = new OrbizNoteManager(
        );
    }

    static getInstance(): OrbizNoteManager {
        if (!this._instance) OEM.throwNotInitializedError(OrbizNoteManager);

        return this._instance;
    }

    /** ------------ */
    private constructor(
    ) { }

    private get app(): App {
        return OAM().app
    }

    // get activeTFile(): TFile | null {
    //     const { app } = OAM();
    //     const tFile = app.workspace.getActiveFile();
    //     if (!tFile) return null;
    //     return tFile;
    // }

    get activeStdNote(): StdNote | null {
        const tFile = OTM().activeTFile;
        if (!tFile) return null;
        return OFM().noteF.tryStdFrom(tFile);
    }

    // get allStdTFiles(): TFile[] {
    //     const files = this.app.vault.getMarkdownFiles();
    //     const rootDir = OAM().rootDir;
    //     return files.filter(file => {
    //         return this.isStdNotePath(file.path);
    //         // [
    //         //     rootDir + "galaxies",
    //         //     rootDir + "logs",
    //         // ].some(targetPath =>
    //         //     file.path.startsWith(targetPath)
    //         // );
    //     });
    // }

    get allStdNoteNames(): string[] {
        // TODO: 規模が大きくなってきたら、fileNames単体のキャッシュを考える。
        return OCM().getAllStdNoteNames();
        // return [...OCM().fileNameToIdMap.keys()];
    }

    get allMyNoteNames(): string[] {
        return OTM().allMyTFiles.map(t => t.basename);
    }

    // 画面上のリーフにあることがキャッシュの条件なので、Note単体でキャッシュを持つことはない。
    // キャッシュがあるとすれば、必ず先にOrbがある。
    getStdNote(src: { noteId?: string, internalLink?: string }): StdNote | null {
        let noteId: string;
        if (src.noteId) {
            noteId = src.noteId;
        } else if (src.internalLink) {
            // 内部リンクとみなす。
            const path = extractLinkTarget(src.internalLink);
            if (!path) return null;
            const tmp = ONM().getNoteIdByPath(path);
            if (!tmp) return null;
            noteId = tmp;
        } else {
            OEM.throwUnexpectedError();
        }

        const orb = OCM().getStdNoteOrb(noteId);
        if (orb) return orb.note;

        return OFM().noteF.tryStdFrom({ noteId });
    }

    getMyNote(src: { noteId?: string, internalLink?: string }): MyNote | null {
        const note = this.getStdNote(src);
        if (!isMyNote(note)) return null;
        return note;
    }

    isStdNotePath(path: string) {
        return OTM().isStdTFilePath(path);
    }
    isDiaryNotePath(path: string) {
        return OTM().isDiaryTFilePath(path);
    }

    isMyNotePath(path: string) {
        const rootDir = OAM().rootPath;
        return path.startsWith(rootDir + "/galaxies");
    }

    isLogNotePath(path: string) {
        const rootDir = OAM().rootPath;
        return path.startsWith(rootDir + "/logs");
    }

    // getStdTFileByPath(path: string): TFile | null {
    //     if (!this.isStdNotePath(path)) return null;
    //     const tFile = OAM().app.vault.getFileByPath(path);
    //     if (!tFile) return null;
    //     return tFile;
    // }

    getStdNoteByName(name: string): StdNote | null {
        // const id = OCM().fileNameToIdMap.get(name);
        const id = OCM().getStdNoteIdByName(name);

        if (!id) return null;
        const source = OCM().getStdNoteSourceById(id);
        if (!source) return null;
        const tFile = OTM().getStdTFileByPath(source.path);
        if (!tFile) return null;
        return OFM().noteF.tryStdFrom(tFile);
    }

    getPathFromNoteName(name: string): string | null {
        // const map = OCM().fileNameToIdMap;
        // const id = map.get(name);
        const id = OCM().getStdNoteIdByName(name);
        if (!id) return null;
        const source = OCM().getStdNoteSourceById(id);
        return source?.path || null;
    }

    getFmCacheByPath(path: string): FrontMatterCache | null {
        return OTM().getFmCacheByPath(path);
        // const tFile = this.getMdTFileByPath(path);
        // if (!tFile) return null;
        // const cache = this.app.metadataCache.getFileCache(tFile);
        // return cache?.frontmatter || null;
    }

    // getMdTFileByPath(path: string): TFile | null {
    //     const tFile = this.app.vault.getFileByPath(path);
    //     if (!tFile) return null;
    //     if (tFile.extension !== "md") return null
    //     return tFile;
    // }

    getNoteIdByTFile(tFile: TFile): string | null {
        const cache = this.app.metadataCache.getFileCache(tFile);
        const fm = cache?.frontmatter;

        if (!fm) {
            return null;
        }

        return fm["id"] || null;
    }

    getNoteIdByPath(path: string): string | null {
        const tFile = OTM().getMdTFileByPath(path);
        if (!tFile) return null;
        return this.getNoteIdByTFile(tFile);
    }
}

export const ONM = () => {
    return OrbizNoteManager.getInstance();
}