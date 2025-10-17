import { TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { DailyNote } from "src/core/domain/DailyNote";
import { LogNote } from "src/core/domain/LogNote";
import { MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { DailyFm, isDailyFm, isLogFm, isMyFm, LogFm, MyFm } from "src/orbits/schema/frontmatters/fm";
export class NoteFactory {
    constructor(
    ) { }

    tryStdFrom(src: TFile | { noteId?: string, internalLink?: string, noteName?: string }): StdNote | null {
        let tFile: TFile;
        if (src instanceof TFile) {
            tFile = src;
        } else {
            if (src.noteId) {
                const tmp = AM.tFile.getNoteTFileById(src.noteId);
                if (!tmp) return null;
                tFile = tmp;
            } else if (src.internalLink) {
                const tmp = AM.tFile.getMdTFileByInternalLink(src.internalLink);
                if (!tmp) return null;
                tFile = tmp;
            } else if (src.noteName) {
                const tmp = AM.tFile.getNoteTFileByNoteName(src.noteName);
                if (!tmp) return null;
                tFile = tmp;
            } else {
                throw new UnexpectedError();
            }
        }

        // const app = OAM().app;
        const { app } = AM.obsidian;
        const fmCache = app.metadataCache.getFileCache(tFile)?.frontmatter;
        if (!fmCache) return null;

        if (isMyFm(fmCache)) {
            return this.forMy(fmCache);
        } else if (isLogFm(fmCache)) {
            return this.forLog(fmCache);
        }
        return null;
    }

    forMy(src: MyFm | TFile): MyNote | null {
        if (isMyFm(src)) {
            return new MyNote(src);
        }
        const fmCache = AM.obsidian.metadataCache.getFileCache(src)?.frontmatter;
        // const fmCache = OAM().app.metadataCache.getFileCache(src)?.frontmatter;
        if (!fmCache) return null;

        if (isMyFm(fmCache)) {
            return new MyNote(fmCache);
        }
        return null;
    }

    forLog(src: LogFm | TFile): LogNote | null {
        if (isLogFm(src)) {
            return new LogNote(src);
        }
        // const fmCache = OAM().app.metadataCache.getFileCache(src)?.frontmatter;
        const fmCache = AM.obsidian.metadataCache.getFileCache(src)?.frontmatter;
        if (!fmCache) return null;

        if (isLogFm(fmCache)) {
            return new LogNote(fmCache);
        }
        return null;
    }

    forDaily(src: {
        tFile?: TFile,
        fmAndPath?: {
            fm: DailyFm,
            path: string
        }
    }): DailyNote | null {
        if (src.tFile) {
            // const fmCache = OAM().app.metadataCache.getFileCache(src.tFile)?.frontmatter;
            const fmCache = AM.obsidian.metadataCache.getFileCache(src.tFile)?.frontmatter;
            if (!fmCache) return null;
            if (isDailyFm(fmCache)) {
                return new DailyNote(fmCache, src.tFile.path);
            }
        } else if (src.fmAndPath) {
            return new DailyNote(src.fmAndPath.fm, src.fmAndPath.path)
        } else {
            throw new UnexpectedError();
        }

        return null;
    }
}