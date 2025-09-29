
import { TFile } from "obsidian";
import { DailyNote, isDailyNote } from "src/core/domain/DailyNote";
import { DiaryNote } from "src/core/domain/DiaryNote";
import { isLogNote, LogNote } from "src/core/domain/LogNote";
import { isMyNote, MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { DailyNoteOrb, DiaryNoteOrb, LogNoteOrb, MyNoteOrb, StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { DailyFm, DiaryFm, isDailyFm, isLogFm, isMyFm, LogFm, MyFm, StdFm } from "src/orbits/schema/frontmatters/fm";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { FmOrbFactory } from "./FmOrbFactory";
import { NoteEditorFactory } from "./NoteEditorFactory";
import { NoteFactory } from "./NoteFactory";
import { NoteReaderFactory } from "./NoteReaderFactory";
import { NoteViewerFactory } from "./NoteViewerFactory";

export class NoteOrbFactory {
    constructor(
        private readonly noteF: NoteFactory,
        private readonly fmOrbF: FmOrbFactory,
        private readonly readerF: NoteReaderFactory,
        private readonly editorF: NoteEditorFactory,
        private readonly viewerF: NoteViewerFactory,
    ) { }

    tryStdFrom(src: TFile | StdNote, options?: { fm: StdFm }): StdNoteOrb | null {
        if (isMyNote(src)) {
            if (isMyFm(options?.fm)) {
                return this.forMy(src, { fm: options.fm })
            }
            return this.forMy(src);
        }
        if (isLogNote(src)) {
            if (isLogFm(options?.fm)) {
                return this.forLog(src, { fm: options.fm })
            }
            return this.forLog(src);
        }

        if (!(src instanceof TFile)) return null;
        const tFile = src;

        const fmCache = OAM().app.metadataCache.getFileCache(tFile)?.frontmatter;

        if (isMyFm(fmCache)) {
            const note = this.noteF.forMy(fmCache);
            if (!note) return null;
            return this.forMy(note);
        } else if (isLogFm(fmCache)) {
            const note = this.noteF.forLog(fmCache);
            if (!note) return null;
            return this.forLog(note);
        }
        return null;
    }

    tryDiaryFrom(src: TFile | DiaryNote, options?: { fm: DiaryFm }): DiaryNoteOrb | null {
        if (isDailyNote(src)) {
            if (isDailyFm(options?.fm)) {
                return this.forDaily(src, { fm: options.fm });
            }
            return this.forDaily(src);
        }

        if (!(src instanceof TFile)) return null;
        const tFile = src;

        const fmCache = OAM().app.metadataCache.getFileCache(tFile)?.frontmatter;

        if (isDailyFm(fmCache)) {
            const note = this.noteF.forDaily({ fmAndPath: { fm: fmCache, path: tFile.path } });
            if (!note) return null;
            return this.forDaily(note);
        }

        return null;
    }


    // NOTE: 新規ノート作成時は、fmCacheに依存できないので、オプションでfmを渡してやる必要がある。
    forMy(src: TFile | MyNote, options?: { fm: MyFm }): MyNoteOrb | null {
        let note: MyNote;
        let tFile: TFile
        let fm: MyFm | undefined = options?.fm;
        if (src instanceof TFile) {
            const tmp = this.noteF.forMy(src);
            if (!tmp) return null;
            note = tmp;
            tFile = src;
        } else {
            note = src;
            tFile = src.tFile;
            // fm = note.fm;
        }

        const fmOrb = this.fmOrbF.forMy(tFile, { fm: fm });
        if (!fmOrb) return null;
        return new MyNoteOrb(
            note,
            fmOrb,
            this.readerF.forMy(note, fmOrb),
            this.editorF.forMy(note, fmOrb),
            this.viewerF.forMy(note, fmOrb),
        );
    }

    forLog(src: TFile | LogNote, options?: { fm: LogFm }): LogNoteOrb | null {
        let note: LogNote;
        let tFile: TFile
        let fm: LogFm | undefined = options?.fm;
        if (src instanceof TFile) {
            const tmp = this.noteF.forLog(src);
            if (!tmp) return null;
            note = tmp;
            tFile = src;
        } else {
            note = src;
            tFile = src.tFile;
            // fm = note.fm;
        }

        const fmOrb = this.fmOrbF.forLog(tFile, { fm: fm });
        if (!fmOrb) return null;
        return new LogNoteOrb(
            note,
            fmOrb,
            this.readerF.forLog(note, fmOrb),
            this.editorF.forLog(note, fmOrb),
            this.viewerF.forLog(note, fmOrb),
        );
    }

    forDaily(src: TFile | DailyNote, options?: { fm: DailyFm }): DailyNoteOrb | null {
        let note: DailyNote;
        let tFile: TFile
        let fm: DailyFm | undefined = options?.fm;
        if (src instanceof TFile) {
            tFile = src;
            const tmp = this.noteF.forDaily({ tFile: src });
            if (!tmp) return null;
            note = tmp;

        } else {
            note = src;
            tFile = src.tFile;
            // fm = note.fm;
        }

        const fmOrb = this.fmOrbF.forDaily(tFile, { fm: fm });
        if (!fmOrb) return null;
        return new DailyNoteOrb(
            note,
            fmOrb,
            this.readerF.forDaily(note, fmOrb),
            this.editorF.forDaily(note, fmOrb),
            this.viewerF.forDaily(note, fmOrb),
        );
    }
}