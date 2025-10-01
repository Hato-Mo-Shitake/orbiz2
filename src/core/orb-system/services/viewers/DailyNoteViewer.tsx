import { DailyNote } from "src/core/domain/DailyNote";
import { DailyFm } from "src/orbits/schema/frontmatters/fm";
import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { DailyFmOrb } from "../../orbs/FmOrb";
import { DailyNoteEditor } from "../editors/DailyNoteEditor";
import { DailyNoteReader } from "../readers/DailyNoteReader";
import { DiaryNoteViewer } from "./DiaryNoteViewer";

export class DailyNoteViewer<
    TFm extends DailyFm = DailyFm,
    TReader extends DailyNoteReader<TFm> = DailyNoteReader<TFm>,
    TEditor extends DailyNoteEditor<TFm> = DailyNoteEditor<TFm>,
> extends DiaryNoteViewer<TFm, TReader, TEditor> {
    constructor(
        public readonly note: DailyNote<TFm>,
        public readonly fmOrb: DailyFmOrb,
        public readonly reader: TReader,
        public readonly editor: TEditor,
        public readonly store: StoreApi<DailyNoteState>
    ) {
        super(note, fmOrb, reader, editor, store);
    }
}