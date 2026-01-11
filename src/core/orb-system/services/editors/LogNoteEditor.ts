
import { LogNote } from "src/core/domain/LogNote";
import { LogFm } from "src/orbits/schema/frontmatters/fm";
import { LogFmOrb } from "../../orbs/FmOrb";
import { StdNoteEditor } from "./StdNoteEditor";

export class LogNoteEditor<TFm extends LogFm = LogFm> extends StdNoteEditor<TFm> {
    constructor(
        public readonly note: LogNote<TFm>,
        public readonly fmOrb: LogFmOrb,
    ) {
        super(
            note,
            fmOrb
        );
    }
}