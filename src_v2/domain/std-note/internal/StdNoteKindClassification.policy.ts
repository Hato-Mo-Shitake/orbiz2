import { logNoteKindValueList, myNoteKindValueList } from "./std-note.rules";
import { StdNoteKind } from "./StdNoteKind.vo";

export class StdNoteKindClassification {
    static isMy(kind: StdNoteKind): boolean {
        return myNoteKindValueList.some(value => kind.is(value));
    }

    static isLog(kind: StdNoteKind): boolean {
        return logNoteKindValueList.some(value => kind.is(value));
    }
}