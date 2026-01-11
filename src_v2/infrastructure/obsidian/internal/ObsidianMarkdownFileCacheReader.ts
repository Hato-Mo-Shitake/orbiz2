import { App, MetadataCache, TFile, Vault } from "obsidian";
import { IFileReader } from "../file/IFileReader";
import { MarkdownFileMetadata } from "../markdown-file/markdown-file.rules";
import { extractMarkdownFileBody } from "../markdown-file/markdown-file.utils";
import { findObsidianMarkdownFile } from "./obsidian-file.utils";

export class ObsidianMarkdownFileCacheReader implements IFileReader<MarkdownFileMetadata> {
    constructor(
        private readonly _app: App
    ) {
    }

    private get _vault(): Vault {
        return this._app.vault;
    }

    private get _metadataCache(): MetadataCache {
        return this._app.metadataCache;
    }

    async exists(path: string): Promise<boolean> {
        return this._findMarkdownFile(path) !== null;
    }

    async readContent(path: string): Promise<string> {
        const file = this._findMarkdownFile(path);
        if (file === null) {
            throw new Error(`obsidian markdown file not found: ${path}`);
        }
        return this._vault.cachedRead(file);
    }

    async readMeta(path: string): Promise<MarkdownFileMetadata> {
        const file = this._findMarkdownFile(path);
        if (!file) {
            throw new Error(`obsidian markdown file not found: ${path}`);
        }

        const metadata = this._metadataCache.getFileCache(file);

        return {
            frontmatter: metadata?.frontmatter,
        };
    }

    async readBody(path: string): Promise<string> {
        const content = await this.readContent(path);
        return extractMarkdownFileBody(content);
    }

    private _findMarkdownFile(path: string): TFile | null {
        return findObsidianMarkdownFile(this._vault, path);
    }
}