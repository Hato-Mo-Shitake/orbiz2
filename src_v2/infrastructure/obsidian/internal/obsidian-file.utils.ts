import { MetadataCache, parseYaml, Plugin, TFile, Vault } from "obsidian";
import { Frontmatter } from "../../markdown-file/markdown-file.rules";
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

export function findObsidianMarkdownFile(
    vault: Vault,
    path: string
): TFile | null {
    const file = vault.getFileByPath(path);
    if (!file) return null;
    if (file.extension !== "md") return null;  // TODO: ".md" じゃなくていいか。要チェック
    return file;
}

export function getObsidianMarkdownFile(
    vault: Vault,
    path: string
): TFile {
    const file = findObsidianMarkdownFile(vault, path);
    if (file === null) {
        throw new Error("Obsidian Markdown File not found.");
    }
    return file;
}

export async function getEnvData(plugin: Plugin): Promise<Record<string, unknown>> {
    return await plugin.loadData();
}

export function getAllFilesByFolderPath(
    vault: Vault,
    folderPath: string
): TFile[] {
    const folder = vault.getFolderByPath(folderPath);
    if (!folder) return [];

    const files: TFile[] = [];

    Vault.recurseChildren(folder, t => {
        if (t instanceof TFile) {
            files.push(t);
        }
    })

    return files;
}

export function getFrontmatterByTFile(
    metadataCache: MetadataCache,
    file: TFile,
): Frontmatter {
    const cache = metadataCache.getFileCache(file);
    const fm = cache?.frontmatter;

    if (fm === undefined) {
        throw Error(`Frontmatter not found. path: ${file.path}`);
    }

    return fm;
}