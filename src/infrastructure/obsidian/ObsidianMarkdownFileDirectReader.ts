import { App, TFile, Vault } from "obsidian";
import { IFileReader } from "../file/IFileSurfacy";
import { MarkdownFileMetadata } from "../markdown-file/markdown-file.rules";
import { findObsidianMarkdownFile, parseObsidianFrontmatter } from "./utils";

export class ObsidianMarkdownFileDirectReader implements IFileReader<MarkdownFileMetadata> {

    constructor(
        private readonly _app: App
    ) {
    }

    private get _vault(): Vault {
        return this._app.vault;
    }

    async exists(path: string): Promise<boolean> {
        return this._findMarkdownFile(path) !== null;
    }

    async readMeta(path: string): Promise<MarkdownFileMetadata> {
        const content = await this.readContent(path);
        const fm = parseObsidianFrontmatter(content);

        return {
            frontmatter: fm,
        };
    }

    async readContent(path: string): Promise<string> {
        const file = this._findMarkdownFile(path);
        if (file === null) {
            throw new Error(`obsidian markdown file not found: ${path}`);
        }
        return this._vault.read(file);
    }

    private _findMarkdownFile(path: string): TFile | null {
        return findObsidianMarkdownFile(this._vault, path);
    }
}