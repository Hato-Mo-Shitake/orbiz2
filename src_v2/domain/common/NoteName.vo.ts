import { ValueObject } from "./ValueObject.vo";

const _brand = "NoteName";

const FILE_NAME_REGEX = /^(?!\.)(?!.*\.$)[^\\:*?"<>|\s]+$/;

/**
 * 
 * @param value 
 * @returns 
 */
function _validate(value: string): void {
    if (!FILE_NAME_REGEX.test(value)) {
        throw new Error("Invalid NoteName value");
    }
}

/**
 * 以下禁止
 * 1.	\ : * ? " < > | を含む
 * 2.	空白文字（\s）を含む
 * 3.	先頭が .
 * 4.	末尾が .
 * 5.	空文字列
 */
export class NoteName extends ValueObject<string> {
    /**
     * 
     * @param value 
     */
    constructor(value: string, brand = _brand) {
        _validate(value);
        super(value, brand);
    }
}