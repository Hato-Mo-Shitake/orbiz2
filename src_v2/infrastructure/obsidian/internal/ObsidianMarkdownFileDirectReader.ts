import { App, TFile, Vault } from "obsidian";
import { IFileReader } from "../file/IFileReader";
import { MarkdownFileMetadata } from "../markdown-file/markdown-file.rules";
import { extractMarkdownFileBody, validateFrontmatter } from "../markdown-file/markdown-file.utils";
import { findObsidianMarkdownFile, parseObsidianFrontmatter } from "./obsidian-file.utils";

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

    async readContent(path: string): Promise<string> {
        const file = this._findMarkdownFile(path);
        if (file === null) {
            throw new Error(`obsidian markdown file not found: ${path}`);
        }
        return this._vault.read(file);
    }

    async readMeta(path: string): Promise<MarkdownFileMetadata> {
        const content = await this.readContent(path);
        const fm = parseObsidianFrontmatter(content);

        if (!validateFrontmatter(fm)) {
            console.error(fm);
            throw new Error("Invalid Markdown File Frontmatter");
        }

        return {
            frontmatter: fm,
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