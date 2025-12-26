import { ValueObject } from "../../common/ValueObject.vo";
import { NoteKindCode, validateNoteKind } from "./note-kind.rules";

const _brand = "NoteKind";
export class NoteKind extends ValueObject<NoteKindCode> {
    private constructor(value: NoteKindCode) {
        validateNoteKind(value);
        super(value, _brand);
    }

    static from(value: NoteKindCode): NoteKind {
        return new NoteKind(value);
    }

    is(value: NoteKindCode) {
        return this.equals(NoteKind.from(value));
    }
}