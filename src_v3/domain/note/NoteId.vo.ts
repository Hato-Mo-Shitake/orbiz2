import { ValueObject } from "src_v3/domain/common/ValueObject.vo";
import { ValueObjectError } from "../common/domain-error";
import { VALUE_OBJECT_ERROR_MSG } from "../common/domain-error.rules";

const _brand = "NoteId";

function _validate(value: string): asserts value is string {
    if (value === "") {
        throw new ValueObjectError(VALUE_OBJECT_ERROR_MSG.invalidValue, _brand, value);
    }
}

/**
 * NoteIdの値オブジェクト
 */
export class NoteId extends ValueObject<string> {
    /**
     * コンストラクタ
     * @param value
     */
    constructor(value: string) {
        _validate(value);
        super(value, _brand);
    }
}