import { FilePath } from "./FilePath.vo";

const _brand = "MarkdownFilePath";

/**
 * 
 * @param value 
 * @returns 
 */
function _validate(value: string): void {
    if (!value.endsWith(".md")) {
        throw new Error("Invalid MarkdownFilePath value: file extension is not '.md'.");
    }
}

/**
 * 
 */
export class MarkdownFilePath extends FilePath {
    /**
     * 
     * @param value 
     */
    constructor(value: string, brand = _brand) {
        _validate(value);
        super(value, brand);
    }
}