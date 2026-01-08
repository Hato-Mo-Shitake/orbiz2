import { DiaryNote } from "src/core/domain/DiaryNote";
import { DiaryFm } from "src/orbits/schema/frontmatters/fm";
import { DiaryFmOrb } from "../../orbs/FmOrb";
import { BaseNoteReader } from "./NoteReader";

export abstract class DiaryNoteReader<TFm extends DiaryFm = DiaryFm> extends BaseNoteReader<TFm> {
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