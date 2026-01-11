import { v4 } from "uuid";
import { ValueObject } from "../../common/ValueObject.vo";

const _brand = "StdNoteId";

function _validate(value: string): void {
    if (value === "") {
        throw new Error("Invalid StdNoteId value: id must not empty.");
    }
}

export class StdNoteId extends ValueObject<string> {
    private constructor(value: string) {
        _validate(value);
        super(value, _brand);
    }

    static from(value: string): StdNoteId {
        return new StdNoteId(value);
    }

    static generate(): StdNoteId {
        return StdNoteId.from(v4())
    }
}