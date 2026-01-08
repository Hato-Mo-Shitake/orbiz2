import { DailyNote } from "src/core/domain/DailyNote";
import { LogNote } from "src/core/domain/LogNote";
import { MyNote } from "src/core/domain/MyNote";
import { DailyFmOrb, LogFmOrb, MyFmOrb } from "src/core/orb-system/orbs/FmOrb";
import { DailyNoteViewer } from "src/core/orb-system/services/viewers/DailyNoteViewer";
import { LogNoteViewer } from "src/core/orb-system/services/viewers/LogNoteViewer";
import { MyNoteViewer } from "src/core/orb-system/services/viewers/MyNoteViewer";
import { DailyNoteState, LogNoteState, MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { NoteEditorFactory } from "./NoteEditorFactory";
import { NoteReaderFactory } from "./NoteReaderFactory";

export class NoteViewerFactory {
    constructor(
        private readonly readerF: NoteReaderFactory,
        private readonly editorF: NoteEditorFactory,
    ) {
    }

    forMy(note: MyNote, fmOrb: MyFmOrb, store: StoreApi<MyNoteState>): MyNoteViewer {
        return new MyNoteViewer(
            note,
            fmOrb,
            this.readerF.forMy(note, fmOrb),
            this.editorF.forMy(note, fmOrb),
            store
        );
    }

    forLog(note: LogNote, fmOrb: LogFmOrb, store: StoreApi<LogNoteState>): LogNoteViewer {
        return new LogNoteViewer(
            note,
            fmOrb,
            this.readerF.forLog(note, fmOrb),
            this.editorF.forLog(note, fmOrb),
            store
        );
    }

    forDaily(note: DailyNote, fmOrb: DailyFmOrb, store: StoreApi<DailyNoteState>): DailyNoteViewer {
        return new DailyNoteViewer(
            note,
            fmOrb,
            this.readerF.forDaily(note, fmOrb),
            this.editorF.forDaily(note, fmOrb),
            store
        );
    }
}