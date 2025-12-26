import { diaryNoteKindList, logNoteKindList, myNoteKindList } from "./note-kind.rules";
import { NoteKind } from "./NoteKind.vo";

export class NoteKindClassification {
    static isMy(noteKind: NoteKind): boolean {
        return myNoteKindList.some(kind => noteKind.is(kind));
    }

    static isLog(noteKind: NoteKind): boolean {
        return logNoteKindList.some(kind => noteKind.is(kind));
    }

    static isStd(noteKind: NoteKind): boolean {
        return this.isMy(noteKind) || this.isLog(noteKind);
    }

    static isDiary(noteKind: NoteKind): boolean {
        return diaryNoteKindList.some(kind => noteKind.is(kind));
    }
}