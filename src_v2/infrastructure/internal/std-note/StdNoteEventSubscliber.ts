import { MarkdownFilePath } from "../../../domain/common/MarkdownFilePath.vo";
import { MarkdownFileMetadata } from "../markdown-file/markdown-file.rules";
import { MarkdownFileEventWatcher } from "../markdown-file/MarkdownFileEventWatcher";
import { StdNoteCacheUpdater } from "./StdNoteCacheUpdater";
import { StdNoteIdTranslator } from "./StdNoteIdTranslator";

export class StdNoteEventSubscriber {
    constructor(
        private readonly _watcher: MarkdownFileEventWatcher,
        private readonly _cacheMaintainer: StdNoteCacheUpdater,
        private readonly _idTranslator: StdNoteIdTranslator,
        private readonly eventBus: any,
    ) {
    }

    subscribe(): void {
        this._subscribeMetadataChanged();
        this._subscribePathChanged();
    }

    private _subscribeMetadataChanged(): void {
        this._watcher.onMarkdownFileMetadataChanged(async (path: MarkdownFilePath, metadata: MarkdownFileMetadata) => {
            const noteId = this._idTranslator.fromMarkdownFilePath(path);
            if (noteId === null) return;

            const outLinkIdList = this._idTranslator.fromMarkdownFileMetadata(metadata);

            this._cacheMaintainer.updateByChangedNoteLinkId(
                noteId,
                outLinkIdList
            );
        });
    }

    private _subscribePathChanged(): void {

    }
} 