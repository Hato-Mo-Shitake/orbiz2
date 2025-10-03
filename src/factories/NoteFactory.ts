import { TFile } from "obsidian";
import { DailyNote } from "src/core/domain/DailyNote";
import { LogNote } from "src/core/domain/LogNote";
import { MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { DailyFm, isDailyFm, isLogFm, isMyFm, LogFm, MyFm } from "src/orbits/schema/frontmatters/fm";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { OTM } from "src/orbiz/managers/OrbizTFileManager";
export class NoteFactory {
    constructor(
    ) { }

    tryStdFrom(src: TFile | { noteId?: string, internalLink?: string, noteName?: string }): StdNote | null {
        let tFile: TFile;
        if (src instanceof TFile) {
            tFile = src;
        } else {
            if (src.noteId) {
                const tmp = OTM().getNoteTFileById(src.noteId);
                if (!tmp) return null;
                tFile = tmp;
            } else if (src.internalLink) {
                const tmp = OTM().getMdTFileByInternalLink(src.internalLink);
                if (!tmp) return null;
                tFile = tmp;
            } else if (src.noteName) {
                const tmp = OTM().getNoteTFileByNoteName(src.noteName);
                if (!tmp) return null;
                tFile = tmp;
            } else {
                OEM.throwUnexpectedError();
            }
        }

        const app = OAM().app;
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
        const fmCache = OAM().app.metadataCache.getFileCache(src)?.frontmatter;
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
        const fmCache = OAM().app.metadataCache.getFileCache(src)?.frontmatter;
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
            const fmCache = OAM().app.metadataCache.getFileCache(src.tFile)?.frontmatter;
            if (!fmCache) return null;
            if (isDailyFm(fmCache)) {
                return new DailyNote(fmCache, src.tFile.path);
            }
        } else if (src.fmAndPath) {
            return new DailyNote(src.fmAndPath.fm, src.fmAndPath.path)
        } else {
            OEM.throwUnexpectedError();
        }

        return null;
    }
}