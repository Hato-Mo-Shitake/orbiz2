import { ValueObject } from "../../common/ValueObject.vo";

const _brand = "TagName";

function _validate(value: string): void {
    if (/^\d+$/.test(value)) {
        throw new Error("TagName value must not be only digits")
    }
}

export class TagName extends ValueObject<string> {
    private constructor(value: string) {
        _validate(value);
        super(value, _brand)
    }

    static from(value: string): TagName {
        return new TagName(value);
    }
}