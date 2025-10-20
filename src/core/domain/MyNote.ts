import { MyFm } from "src/orbits/schema/frontmatters/fm";
import { StdNote } from "./StdNote";

export class MyNote<TFm extends MyFm = MyFm> extends StdNote<TFm> {
    get isRoleNode(): boolean {
        return this.fmCache["roleKind"];
    }
}
export function isMyNote(note: any): note is MyNote {
    return note instanceof MyNote;
}