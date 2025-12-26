import { _allNoteKindList } from "./NoteKind.vo";

export function testNoteAPI(value: any) {
    return value == _allNoteKindList
}