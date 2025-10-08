import { App, FrontMatterCache, TFile } from "obsidian";
import { extractLinkTarget } from "src/assistance/utils/filter";
import { getBasenameFromPath } from "src/assistance/utils/path";
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

    get activeStdNote(): StdNote | null {
        const tFile = OTM().activeTFile;
        if (!tFile) return null;
        return OFM().noteF.tryStdFrom(tFile);
    }

    get allStdNoteNames(): string[] {
        // TODO: 規模が大きくなってきたら、fileNames単体のキャッシュを考える。
        return OCM().getAllStdNoteNames();
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

    isNotePath(path: string) {
        return this.isStdNotePath(path) || this.isDiaryNotePath(path);
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

    getStdNoteByName(name: string): StdNote | null {
        const id = OCM().getStdNoteIdByName(name);

        if (!id) return null;
        const source = OCM().getStdNoteSourceById(id);
        if (!source) return null;
        const tFile = OTM().getStdTFileByPath(source.path);
        if (!tFile) return null;
        return OFM().noteF.tryStdFrom(tFile);
    }

    getPathFromNoteName(name: string): string | null {
        const id = OCM().getStdNoteIdByName(name);
        if (!id) return null;
        const source = OCM().getStdNoteSourceById(id);
        return source?.path || null;
    }

    getFmCacheByPath(path: string): FrontMatterCache | null {
        return OTM().getFmCacheByPath(path);
    }

    getNoteIdByTFile(tFile: TFile): string | null {
        const cache = this.app.metadataCache.getFileCache(tFile);
        const fm = cache?.frontmatter;

        if (fm) {
            return fm["id"] || null;
        }

        // 新規ノート作成直後だと,fmCacheが基本nullになるので、一旦こうしているが。。。。
        return OCM().getStdNoteIdByName(getBasenameFromPath(tFile.path));
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