import { DiaryNote } from "src/core/domain/DiaryNote";
import { DiaryFm } from "src/orbits/schema/frontmatters/fm";
import { DiaryFmOrb } from "../../orbs/FmOrb";
import { BaseNoteEditor } from "./NoteEditor";

export abstract class DiaryNoteEditor<TFm extends DiaryFm = DiaryFm> extends BaseNoteEditor<TFm> {
    constructor(
        public readonly note: DiaryNote<TFm>,
        public readonly fmOrb: DiaryFmOrb,
    ) {
        super(
            note,
            fmOrb
        );
    }
}