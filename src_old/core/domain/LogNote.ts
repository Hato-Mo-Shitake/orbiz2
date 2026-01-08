import { LogFm } from "src/orbits/schema/frontmatters/fm";
import { StdNote } from "./StdNote";

export class LogNote<TFm extends LogFm = LogFm> extends StdNote<TFm> {
    get isResolved() {
        return Boolean(this.fmCache["resolved"]);
    }
}
export function isLogNote(note: any): note is LogNote {
    if (note instanceof LogNote) {
        const fmCache = note.fmCache;
        if (!fmCache) return false;
        return fmCache["type"] == "logNote";
    }
    return false;
}