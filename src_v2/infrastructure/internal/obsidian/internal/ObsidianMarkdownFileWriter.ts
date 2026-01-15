import { App, FileManager, Vault } from "obsidian";
import { FileWriter } from "../../file/FileWriter";
import { MarkdownFileEditableFeature } from "../../markdown-file/MarkdownFileEditableFeature";
import { Frontmatter, FrontmatterAttrs, MarkdownFileMetadata } from "../../markdown-file/markdown-file.rules";
import { extractMarkdownFileFrontmatterBlock } from "../../markdown-file/markdown-file.utils";
import { getObsidianMarkdownFile } from "./obsidian-markdown-file.helpers";

export class ObsidianMarkdownFileCacheWriter implements FileWriter<MarkdownFileMetadata>, MarkdownFileEditableFeature {
    constructor(
        private readonly _app: App,
    ) {
    }

    private get _vault(): Vault {
        return this._app.vault;
    }

    private get _fileManager(): FileManager {
        return this._app.fileManager;
    }

    async saveContent(path: string, content: string): Promise<void> {
        const file = getObsidianMarkdownFile(this._vault, path);
        this._vault.modify(file, content);
    }

    async saveMeta(path: string, metadata: MarkdownFileMetadata): Promise<void> {
        const newFm = metadata.frontmatter;
        if (newFm === undefined) return;
        this.saveFrontmatter(path, newFm);
    }

    async saveBody(path: string, body: string): Promise<void> {
        const file = getObsidianMarkdownFile(this._vault, path);
        const currentContent = await this._vault.read(file);

        const frontmatterBlock = extractMarkdownFileFrontmatterBlock(currentContent);

        const newContent = frontmatterBlock
            ? `---\n${frontmatterBlock}\n---\n${body}`
            : body;

        await this._vault.modify(file, newContent);
    }

    async saveFrontmatter(path: string, frontmatter: Frontmatter): Promise<void> {
        const file = getObsidianMarkdownFile(this._vault, path);
        this._fileManager.processFrontMatter(file, currentFm => {
            Object.keys(currentFm).forEach(key => delete currentFm[key]);
            Object.assign(currentFm, frontmatter);
        });
    }

    async saveFrontmatterAttrs(path: string, attrs: FrontmatterAttrs): Promise<void> {
        const file = getObsidianMarkdownFile(this._vault, path);
        this._fileManager.processFrontMatter(file, currentFm => {
            Object.assign(currentFm, attrs);
        });
    }
}