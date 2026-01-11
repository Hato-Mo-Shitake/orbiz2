
import { MyNote } from "src/core/domain/MyNote";
import { MyFm } from "src/orbits/schema/frontmatters/fm";
import { MyFmOrb } from "../../orbs/FmOrb";
import { StdNoteEditor } from "./StdNoteEditor";

export class MyNoteEditor<TFm extends MyFm = MyFm> extends StdNoteEditor<TFm> {
    constructor(
        public readonly note: MyNote<TFm>,
        public readonly fmOrb: MyFmOrb,
    ) {
        super(
            note,
            fmOrb
        );
    }
}