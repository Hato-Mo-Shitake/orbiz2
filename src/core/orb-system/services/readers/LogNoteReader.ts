import { LogNote } from "src/core/domain/LogNote";
import { LogFm } from "src/orbits/schema/frontmatters/fm";
import { LogFmOrb } from "../../orbs/FmOrb";
import { StdNoteReader } from "./StdNoteReader";

export class LogNoteReader<TFm extends LogFm = LogFm> extends StdNoteReader<TFm> {
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