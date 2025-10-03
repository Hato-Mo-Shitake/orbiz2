import { BaseNote } from "src/core/domain/Note";
import { BaseFmOrb } from "src/core/orb-system/orbs/FmOrb";
import { BaseFm } from "src/orbits/schema/frontmatters/fm";

export abstract class BaseNoteReader<TFm extends BaseFm = BaseFm> {
    constructor(
        readonly note: BaseNote<TFm>,
        public readonly fmOrb: BaseFmOrb
    ) {
    }
}
