import { debugConsole } from "src/assistance/utils/debug";
import { MyFm } from "src/orbits/schema/frontmatters/fm";
import { StdNote } from "./StdNote";

export class MyNote<TFm extends MyFm = MyFm> extends StdNote<TFm> {
}
export function isMyNote(note: any): note is MyNote {

    if (note instanceof MyNote) {
        debugConsole("どっち");
        const fmCache = note.fmCache;
        if (!fmCache) return false;
        debugConsole("どっち");
        return fmCache["type"] == "myNote";
    }
    debugConsole("ここ？");
    return false;
}