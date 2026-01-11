import { ValueObject } from "../../common/ValueObject.vo";
import { StdNoteKindValue, validateStdNoteKindValue } from "./std-note.rules";

const _brand = "StdNoteKind";

function _validate(value: string): asserts value is StdNoteKindValue {
    try {
        validateStdNoteKindValue(value);
    } catch (e) {
        console.error(e);
        throw new Error("Invalid StdNoteKind value:" + value);
    }
}

export class StdNoteKind extends ValueObject<StdNoteKindValue> {
    private constructor(value: StdNoteKindValue) {
        _validate(value);
        super(value, _brand);
    }

    static from(value: StdNoteKindValue): StdNoteKind {
        return new StdNoteKind(value);
    }

    static fromUnknown(value: unknown): StdNoteKind {
        return new StdNoteKind(value as any);
    }

    is(value: StdNoteKindValue) {
        return this.equals(StdNoteKind.from(value));
    }
}