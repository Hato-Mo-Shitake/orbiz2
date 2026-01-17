import { App, CachedMetadata, MetadataCache, Plugin, TAbstractFile, TFile, Vault } from "obsidian";
import { MarkdownFilePath } from "../../../../domain/common/MarkdownFilePath.vo";
import { MarkdownFileMetadata } from "../../markdown-file/markdown-file.rules";
import { MarkdownFileEventWatcher } from "../../markdown-file/MarkdownFileEventWatcher";

export class ObsidianMarkdownFileEventWatcher implements MarkdownFileEventWatcher {
    constructor(
        private readonly _app: App,
        private readonly _plugin: Plugin,
    ) {

    }

    private get _metadataCache(): MetadataCache {
        return this._app.metadataCache;
    }

    private get _vault(): Vault {
        return this._app.vault;
    }

    onMetadataChanged(callback: (path: MarkdownFilePath, metadata: MarkdownFileMetadata) => Promise<void>): void {
        const ref = this._metadataCache.on("changed", async (file: TFile, data: string, cache: CachedMetadata) => {

            const path = MarkdownFilePath.tryFrom(file.path);
            if (path === null) return;

            const fm = cache?.frontmatter;
            const metadata: MarkdownFileMetadata = {
                frontmatter: fm,
            }

            await callback(path, metadata);
        })

        this._plugin.registerEvent(ref);
    }

    onPathChanged(callback: (newPath: MarkdownFilePath, oldPath: MarkdownFilePath) => Promise<void>): void {
        const ref = this._vault.on("rename", async (file: TAbstractFile, oldPath: string) => {

            const newMdPath = MarkdownFilePath.tryFrom(file.path);
            if (newMdPath === null) return;

            const oldMdPath = MarkdownFilePath.tryFrom(file.path);
            if (oldMdPath === null) return;

            await callback(newMdPath, oldMdPath);
        });

        this._plugin.registerEvent(ref);
    }
}