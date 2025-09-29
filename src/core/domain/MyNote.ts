import { MyFm } from "src/orbits/schema/frontmatters/fm";
import { StdNote } from "./StdNote";

export class MyNote<TFm extends MyFm = MyFm> extends StdNote<TFm> {
}
export function isMyNote(note: any): note is MyNote {
    if (note instanceof MyNote) {
        const fmCache = note.fmCache;
        if (!fmCache) return false;
        return fmCache["type"] == "myNote";
    }
    return false;
}