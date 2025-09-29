import { DailyNote } from "src/core/domain/DailyNote";
import { DailyFm } from "src/orbits/schema/frontmatters/fm";
import { DailyFmOrb } from "../../orbs/FmOrb";
import { DiaryNoteReader } from "./DiaryNoteReader";

export class DailyNoteReader<TFm extends DailyFm = DailyFm> extends DiaryNoteReader<TFm> {
    constructor(
        public readonly note: DailyNote<TFm>,
        public readonly fmOrb: DailyFmOrb,
    ) {
        super(
            note,
            fmOrb
        );
    }
}
