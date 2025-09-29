import { DiaryNote } from "src/core/domain/DiaryNote";
import { DiaryFm } from "src/orbits/schema/frontmatters/fm";
import { DiaryFmOrb } from "../../orbs/FmOrb";
import { DiaryNoteEditor } from "../editors/DiaryNoteEditor";
import { DiaryNoteReader } from "../readers/DiaryNoteReader";
import { BaseNoteViewer } from "./NoteViewer";

export abstract class DiaryNoteViewer<
    TFm extends DiaryFm = DiaryFm,
    TReader extends DiaryNoteReader<TFm> = DiaryNoteReader<TFm>,
    TEditor extends DiaryNoteEditor<TFm> = DiaryNoteEditor<TFm>,
> extends BaseNoteViewer<TFm, TReader, TEditor> {
    constructor(
        public readonly note: DiaryNote<TFm>,
        public readonly fmOrb: DiaryFmOrb,
        public readonly reader: TReader,
        public readonly editor: TEditor,
    ) {
        super(note, fmOrb, reader, editor);
    }
}