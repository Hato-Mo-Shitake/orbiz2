import { parseYaml } from "obsidian";
import { extractMarkdownFileFrontmatterBlock } from "../../markdown-file/markdown-file.utils";

export function parseObsidianFrontmatter(
    content: string
): Record<string, unknown> | undefined {
    const block = extractMarkdownFileFrontmatterBlock(content);
    if (!block) return undefined;

    try {
        const data = parseYaml(block);
        if (typeof data !== "object" || data === null) {
            return undefined;
        }
        return data as Record<string, unknown>;
    } catch {
        return undefined;
    }
}