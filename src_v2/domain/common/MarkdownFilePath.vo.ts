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
    private constructor(value: string, brand = _brand) {
        _validate(value);
        super(value, brand);
    }

    static from(value: string): MarkdownFilePath {
        return new MarkdownFilePath(value);
    }

    static tryFrom(value: string): MarkdownFilePath | null {
        try {
            return MarkdownFilePath.from(value);
        } catch (e) {
            return null;
        }
    }

    toString(): string {
        return this._value;
    }
}