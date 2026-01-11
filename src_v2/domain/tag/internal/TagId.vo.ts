import { ValueObject } from "../../common/ValueObject.vo";

const _brand = "TagId";

function _validate(value: string): void {
    if (value === "") {
        throw new Error("TagId value must not be empty.")
    }
}

export class TagId extends ValueObject<string> {
    private constructor(value: string) {
        _validate(value);
        super(value, _brand);
    }

    static from(value: string): TagId {
        return new TagId(value);
    }
}