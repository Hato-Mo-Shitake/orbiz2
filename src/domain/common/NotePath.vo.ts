import { MarkdownFilePath } from "./MarkdownFilePath.vo";

const _brand = "NotePath";

const ROOT_DIR_REGEX = /^[A-Za-z1-9]+-space$/;

function _validate(value: string): void {
    if (!value.includes("/")) {
        throw new Error("Invalid NotePath value: files are not allowed at the vault root level.");
    }

    // ② 最上位ディレクトリ名チェック
    const firstSegment = value.split("/")[0];
    if (!ROOT_DIR_REGEX.test(firstSegment)) {
        throw new Error("Invalid NotePath value: top-level directory name format must be 'xxx-space'.");
    }
}

/**
 * 
 */
export class NotePath extends MarkdownFilePath {
    /**
     * 
     * @param value 
     */
    constructor(value: string, brand = _brand) {
        super(value, brand);

        // 先にファイルパス検証をしたいので、後バリデーション
        _validate(value);
    }
}