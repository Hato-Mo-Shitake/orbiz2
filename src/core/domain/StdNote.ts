import { StdFm } from "src/orbits/schema/frontmatters/fm";
import { SubNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { StdNoteSource } from "src/orbits/schema/NoteSource";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { BaseNote } from "./Note";

export abstract class StdNote<TFm extends StdFm = StdFm> extends BaseNote<TFm> {
    get source(): StdNoteSource {
        const source = OCM().getStdNoteSourceById(this.id);
        if (!source) throw new Error("not found not source.")

        return source;
    }

    get path(): string {
        return this.source.path;
    }

    get subType(): SubNoteType {
        return this.fmCache["subType"];
    }
}
export function isStdNote(note: any): note is StdNote {
    return note instanceof StdNote;
}