import { MarkdownFileMetadata } from "../markdown-file/markdown-file.rules";
import { MarkdownFileEventWatcher } from "../markdown-file/MarkdownFileEventWatcher";
import { StdNoteCacheMaintainer } from "./StdNoteCacheMaintainer";

export class StdNoteEventSubscriber {
    constructor(
        private readonly _watcher: MarkdownFileEventWatcher,
        private readonly _cacheMaintainer: StdNoteCacheMaintainer,
        private readonly eventBus: any,
    ) {
    }

    subscribe(): void {
        this._subscribeMetadataChanged();
        this._subscribePathChanged();
    }

    private _subscribeMetadataChanged(): void {
        this._watcher.onMarkdownFileMetadataChanged(async (path: string, metadata: MarkdownFileMetadata) => {




            // ここでmetadataってワード使うのもどうなんだろ
            this._cacheMaintainer.updateByChangedNoteMetadata(

            );



        });
    }

    private _subscribePathChanged(): void {

    }
} 