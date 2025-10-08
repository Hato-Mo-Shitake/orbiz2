
import { StdNote } from "src/core/domain/StdNote";
import { FmKey } from "src/orbits/contracts/fmKey";
import { StdFm } from "src/orbits/schema/frontmatters/fm";
import { StdFmOrb } from "../../orbs/FmOrb";
import { BaseNoteEditor } from "./NoteEditor";

export abstract class StdNoteEditor<TFm extends StdFm = StdFm> extends BaseNoteEditor<TFm> {
    constructor(
        public readonly note: StdNote<TFm>,
        public readonly fmOrb: StdFmOrb,
    ) {
        super(
            note,
            fmOrb
        );
    }

    addLinkedNote(note: StdNote, fmKey: FmKey<"stdLinkedNoteList">): this {
        this.fmOrb[fmKey].addNewAVal(note);
        return this;
    }
}