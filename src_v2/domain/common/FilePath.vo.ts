import { ValueObject } from "./ValueObject.vo";

const _brand = "FilePath";

/**
 * 先頭の/禁止, //禁止, 各パスセグメントの先頭・末尾の.禁止, \ : * ? " < > |（Windowsで各パスセグメントに使えない文字）禁止, 空白文字禁止
 */
const PATH_REGEX = /^(?!\/)(?!.*\/\/)(?:(?!\.)(?![^/]*\.$)[^/\\:*?"<>|\s]+)(?:\/(?:(?!\.)(?![^/]*\.$)[^/\\:*?"<>|\s]+))*$/;

/**
 * 
 * @param value 
 * @returns 
 */
function _validate(value: string): void {
    if (!PATH_REGEX.test(value)) {
        throw new Error("Invalid FilePath value");
    }
}

/**
 * 正規化（Windows → Unix）
 * @param value 
 * @returns 
 */
function _filter(value: string): string {
    return value.replace(/\\/g, "/");
}

/**
 * 相対パス（先頭に/がない）
 */
export class FilePath extends ValueObject<string> {
    constructor(value: string, brand = _brand) {
        _validate(value);
        super(_filter(value), brand);
    }
}