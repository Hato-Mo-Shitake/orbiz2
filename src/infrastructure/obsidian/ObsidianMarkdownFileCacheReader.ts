import { App, MetadataCache, TFile, Vault } from "obsidian";
import { IFileReader } from "../file/IFileSurfacy";
import { MarkdownFileMetadata } from "../markdown-file/markdown-file.rules";
import { findObsidianMarkdownFile } from "./utils";

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

    async readContent(path: string): Promise<string> {
        const file = this._findMarkdownFile(path);
        if (file === null) {
            throw new Error(`obsidian markdown file not found: ${path}`);
        }
        return this._vault.cachedRead(file);
    }

    private _findMarkdownFile(path: string): TFile | null {
        return findObsidianMarkdownFile(this._vault, path);
    }
}