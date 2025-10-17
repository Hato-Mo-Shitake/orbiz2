import { App, FrontMatterCache, TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { extractLinkTarget } from "src/assistance/utils/filter";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { isMyNote, MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { NotInitializedError } from "src/errors/NotInitializedError";
import { UnexpectedError } from "src/errors/UnexpectedError";

export class NoteManager {
    private static _instance: NoteManager | null = null;

    static setInstance(): void {
        this._instance = new NoteManager(
        );
    }

    static getInstance(): NoteManager {
        if (!this._instance) throw new NotInitializedError();
        // OEM.throwNotInitializedError(OrbizNoteManager);

        return this._instance;
    }

    /** ------------ */
    private constructor(
    ) { }

    private get app(): App {
        return AM.obsidian.app
        // return OAM().app
    }

    get activeStdNote(): StdNote | null {
        const tFile = AM.tFile.activeTFile;
        if (!tFile) return null;
        return AM.factory.noteF.tryStdFrom(tFile);
    }

    get allStdNoteNames(): string[] {
        // TODO: 規模が大きくなってきたら、fileNames単体のキャッシュを考える。
        return AM.cache.getAllStdNoteNames();
    }

    get allMyNoteNames(): string[] {
        return AM.tFile.allMyTFiles.map(t => t.basename);
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
            // const tmp = AM.note.getNoteIdByPath(path);
            const tmp = this.getNoteIdByPath(path);
            if (!tmp) return null;
            noteId = tmp;
        } else {
            throw new UnexpectedError();
            // throw new UnexpectedError();
        }

        const orb = AM.cache.getStdNoteOrb(noteId);
        if (orb) return orb.note;

        return AM.factory.noteF.tryStdFrom({ noteId });
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
        return AM.tFile.isStdTFilePath(path);
    }
    isDiaryNotePath(path: string) {
        return AM.tFile.isDiaryTFilePath(path);
    }

    isMyNotePath(path: string) {
        const rootDir = AM.orbiz.rootPath;
        // const rootDir = OAM().rootPath;
        return path.startsWith(rootDir + "/galaxies");
    }

    isLogNotePath(path: string) {
        const rootDir = AM.orbiz.rootPath;
        // const rootDir = OAM().rootPath;
        return path.startsWith(rootDir + "/logs");
    }

    getStdNoteByName(name: string): StdNote | null {
        const id = AM.cache.getStdNoteIdByName(name);

        if (!id) return null;
        const source = AM.cache.getStdNoteSourceById(id);
        if (!source) return null;
        const tFile = AM.tFile.getStdTFileByPath(source.path);
        if (!tFile) return null;
        return AM.factory.noteF.tryStdFrom(tFile);
    }

    getPathFromNoteName(name: string): string | null {
        const id = AM.cache.getStdNoteIdByName(name);
        if (!id) return null;
        const source = AM.cache.getStdNoteSourceById(id);
        return source?.path || null;
    }

    getFmCacheByPath(path: string): FrontMatterCache | null {
        return AM.tFile.getFmCacheByPath(path);
    }

    getNoteIdByTFile(tFile: TFile): string | null {
        const cache = this.app.metadataCache.getFileCache(tFile);
        const fm = cache?.frontmatter;

        if (fm) {
            return fm["id"] || null;
        }

        // 新規ノート作成直後だと,fmCacheが基本nullになるので、一旦こうしているが。。。。
        return AM.cache.getStdNoteIdByName(getBasenameFromPath(tFile.path));
    }

    getNoteIdByPath(path: string): string | null {
        const tFile = AM.tFile.getMdTFileByPath(path);
        if (!tFile) return null;
        return this.getNoteIdByTFile(tFile);
    }
}
