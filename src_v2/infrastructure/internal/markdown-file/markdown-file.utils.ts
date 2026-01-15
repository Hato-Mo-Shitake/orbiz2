import { Frontmatter, FrontmatterAttrs, FrontmatterValue } from "./markdown-file.rules";

export type FrontmatterRange = {
    start: number; // content 上の開始位置（--- の直後）
    end: number;   // content 上の終了位置（--- の直前）
    rawStart: number; // "---" を含む開始位置
    rawEnd: number;   // 終了 "---" の直後
};

export function findMarkdownFileFrontmatterRange(
    content: string
): FrontmatterRange | null {
    if (!content.startsWith("---")) return null;

    const rawEnd = content.indexOf("\n---", 3);
    if (rawEnd === -1) return null;

    return {
        rawStart: 0,
        start: 3,
        end: rawEnd,
        rawEnd: rawEnd + "\n---".length,
    };
}

export function extractMarkdownFileFrontmatterBlock(
    content: string
): string | null {
    const range = findMarkdownFileFrontmatterRange(content);
    if (!range) return null;

    return content.slice(range.start, range.end).trim();
}

export function extractMarkdownFileBody(
    content: string
): string {
    const range = findMarkdownFileFrontmatterRange(content);
    if (!range) return content;

    let body = content.slice(range.rawEnd);

    if (body.startsWith("\r\n")) {
        body = body.slice(2);
    } else if (body.startsWith("\n")) {
        body = body.slice(1);
    }

    return body;
}

export function isValidFrontmatterValue(value: unknown): value is FrontmatterValue {
    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.every(
            v => typeof v === "string" || typeof v === "number" || typeof v === "boolean"
        );
    }

    return false;
}

export function validateFrontmatterAttrs(attrs: unknown): attrs is FrontmatterAttrs {
    if (typeof attrs !== "object" || attrs === null) return false;

    return Object.values(attrs).every(isValidFrontmatterValue);
}

export function validateFrontmatter(frontmatter: unknown): frontmatter is Frontmatter {
    return validateFrontmatterAttrs(frontmatter);
}