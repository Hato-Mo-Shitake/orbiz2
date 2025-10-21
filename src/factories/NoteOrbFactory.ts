
import { TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { DailyNote, isDailyNote } from "src/core/domain/DailyNote";
import { DiaryNote } from "src/core/domain/DiaryNote";
import { isLogNote, LogNote } from "src/core/domain/LogNote";
import { isMyNote, MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { BaseFmOrb, DailyFmOrb, DiaryFmOrb, LogFmOrb, MyFmOrb, StdFmOrb } from "src/core/orb-system/orbs/FmOrb";
import { DailyNoteOrb, DiaryNoteOrb, LogNoteOrb, MyNoteOrb, StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { DailyFm, DiaryFm, isDailyFm, isLogFm, isMyFm, LogFm, MyFm, StdFm } from "src/orbits/schema/frontmatters/fm";
import { StdNoteSource } from "src/orbits/schema/NoteSource";
import { BaseNoteState, createDailyNoteState, createLogNoteState, createMyNoteState, DailyNoteState, DiaryNoteState, LogNoteState, MyNoteState, StdNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
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

        // const fmCache = OAM().app.metadataCache.getFileCache(tFile)?.frontmatter;
        const fmCache = AM.obsidian.metadataCache.getFileCache(tFile)?.frontmatter;

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

        // const fmCache = OAM().app.metadataCache.getFileCache(tFile)?.frontmatter;
        const fmCache = AM.obsidian.metadataCache.getFileCache(tFile)?.frontmatter;

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
        const fm: MyFm | undefined = options?.fm;
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

        const store = createMyNoteState();
        const fmOrb = this.fmOrbF.forMy(tFile, { fm: fm });
        if (!fmOrb) return null;
        this._initializeMyStore(store, fmOrb, note.source);
        return new MyNoteOrb(
            note,
            fmOrb,
            this.readerF.forMy(note, fmOrb),
            this.editorF.forMy(note, fmOrb),
            this.viewerF.forMy(note, fmOrb, store),
            store,
        );
    }

    forLog(src: TFile | LogNote, options?: { fm: LogFm }): LogNoteOrb | null {
        let note: LogNote;
        let tFile: TFile
        const fm: LogFm | undefined = options?.fm;
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

        const store = createLogNoteState();
        const fmOrb = this.fmOrbF.forLog(tFile, { fm: fm });
        if (!fmOrb) return null;
        this._initializeLogStore(store, fmOrb, note.source);
        return new LogNoteOrb(
            note,
            fmOrb,
            this.readerF.forLog(note, fmOrb),
            this.editorF.forLog(note, fmOrb),
            this.viewerF.forLog(note, fmOrb, store),
            store
        );
    }

    forDaily(src: TFile | DailyNote, options?: { fm: DailyFm }): DailyNoteOrb | null {
        let note: DailyNote;
        let tFile: TFile
        const fm: DailyFm | undefined = options?.fm;
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

        const store = createDailyNoteState();
        const fmOrb = this.fmOrbF.forDaily(tFile, { fm: fm });
        if (!fmOrb) return null;

        this._initializeDailyStore(store, fmOrb);
        return new DailyNoteOrb(
            note,
            fmOrb,
            this.readerF.forDaily(note, fmOrb),
            this.editorF.forDaily(note, fmOrb),
            this.viewerF.forDaily(note, fmOrb, store),
            store
        );
    }

    private _initializeBaseStore(store: StoreApi<BaseNoteState>, fmOrb: BaseFmOrb) {
        fmOrb.tags.setStore(store);
    }

    private _initializeStdStore(store: StoreApi<StdNoteState>, fmOrb: StdFmOrb, source: StdNoteSource) {
        this._initializeBaseStore(store, fmOrb);
        fmOrb.belongsTo.setStore(store);
        fmOrb.relatesTo.setStore(store);
        fmOrb.references.setStore(store);

        const state = store.getState();
        state.setInLinkIds([...source.inLinkIds]);
        state.setOutLinkIds([...source.outLinkIds]);
    }
    private _initializeMyStore(store: StoreApi<MyNoteState>, fmOrb: MyFmOrb, source: StdNoteSource) {
        this._initializeStdStore(store, fmOrb, source);

        fmOrb.subType.setStore(store);
        fmOrb.rank.setStore(store);
        fmOrb.categories.setStore(store);
        fmOrb.aliases.setStore(store);
        fmOrb.aspect.setStore(store);
        fmOrb.roleKind.setStore(store);
        fmOrb.roleHub.setStore(store);
    }
    private _initializeLogStore(store: StoreApi<LogNoteState>, fmOrb: LogFmOrb, source: StdNoteSource) {
        this._initializeStdStore(store, fmOrb, source);

        fmOrb.subType.setStore(store);
        fmOrb.status.setStore(store);
        fmOrb.due.setStore(store);
        fmOrb.resolved.setStore(store);
        fmOrb.context.setStore(store);
    }

    private _initializeDiaryStore(store: StoreApi<DiaryNoteState>, fmOrb: DiaryFmOrb) {
        this._initializeBaseStore(store, fmOrb);

        // fmOrb.subType.setStore(store);
        fmOrb.score.setStore(store);
        fmOrb.isClosed.setStore(store);
    }
    private _initializeDailyStore(store: StoreApi<DailyNoteState>, fmOrb: DailyFmOrb) {
        this._initializeDiaryStore(store, fmOrb);
        fmOrb.theDay.setStore(store);
        fmOrb.createdNotes.setStore(store);
        fmOrb.modifiedNotes.setStore(store);
        fmOrb.resolvedNotes.setStore(store);
        fmOrb.amountSpent.setStore(store);
        fmOrb.templateDone.setStore(store);
    }
}