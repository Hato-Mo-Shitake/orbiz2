import { _allNoteKindList } from "@/domain/note";

export function testTagAPI(value: any) {
    return value == _allNoteKindList;
}

