import { App, CachedMetadata, MetadataCache, Plugin, TAbstractFile, TFile, Vault } from "obsidian";
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

    onMarkdownFileMetadataChanged(callback: (path: string, metadata: MarkdownFileMetadata) => Promise<void>): void {
        const ref = this._metadataCache.on("changed", async (file: TFile, data: string, cache: CachedMetadata) => {

            const path = file.path;
            const fm = cache?.frontmatter;
            const metadata: MarkdownFileMetadata = {
                frontmatter: fm,
            }

            await callback(path, metadata);
        })

        this._plugin.registerEvent(ref);
    }

    onMarkdownFilePathChanged(callback: (newPath: string, oldPath: string) => Promise<void>): void {
        const ref = this._vault.on("rename", async (file: TAbstractFile, oldPath: string) => {

            const newPath = file.path;

            await callback(newPath, oldPath);
        });

        this._plugin.registerEvent(ref);
    }
}