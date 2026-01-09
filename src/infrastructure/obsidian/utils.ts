import { parseYaml, TFile, Vault } from "obsidian";
import { extractFrontmatterBlock } from "../markdown-file/utils";

export function parseObsidianFrontmatter(
    content: string
): Record<string, unknown> | undefined {
    const block = extractFrontmatterBlock(content);
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

export function findObsidianMarkdownFile(
    vault: Vault,
    path: string
): TFile | null {
    const file = vault.getFileByPath(path);
    if (!file) return null;
    if (file.extension !== "md") return null;  // TODO: ".md" じゃなくていいか。要チェック
    return file;
}