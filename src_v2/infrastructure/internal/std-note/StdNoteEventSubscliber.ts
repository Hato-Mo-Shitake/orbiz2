import { MarkdownFilePath } from "../../../domain/common/MarkdownFilePath.vo";
import { StdNoteId, StdNotePath } from "../../../domain/std-note";
import { TrashedNotePath } from "../../../domain/trashed-note/TrashedNotePath.vo";
import { MarkdownFileMetadata } from "../markdown-file/markdown-file.rules";
import { MarkdownFileEventWatcher } from "../markdown-file/MarkdownFileEventWatcher";
import { StdNoteCacheUpdater } from "./StdNoteCacheUpdater";
import { StdNoteIdTranslator } from "./StdNoteIdTranslator";

export class StdNoteEventSubscriber {
    constructor(
        private readonly _mdFileWatcher: MarkdownFileEventWatcher,
        private readonly _cacheUpdater: StdNoteCacheUpdater,
        private readonly _idTranslator: StdNoteIdTranslator,
        // private readonly _eventBus: StdNoteEventBus,
    ) {
    }

    subscribe(): void {
        this._subscribeMetadataChanged();
        this._subscribePathChanged();
    }

    private _subscribeMetadataChanged(): void {
        this._mdFileWatcher.onMetadataChanged(async (path: MarkdownFilePath, metadata: MarkdownFileMetadata) => {
            const notePath = StdNotePath.tryFrom(path.toString());
            if (notePath === null) {
                // StdNoteじゃないのでスルー
                // 効率の最適化を目指すなら、ここでDiaryNoteの処理も行うべきだけど、とりあえずそこまでしなくていいかな。複雑になるし
                return;
            }

            const noteId = this._idTranslator.tryFromStdNotePath(notePath);
            if (noteId === null) {
                const rawId = metadata?.frontmatter?.["id"];
                if (!String.isString(rawId)!) {
                    console.error(`invalid std-note id. path: ${path}`);
                    return;
                }

                const newOutLinkIdList = this._idTranslator.fromMarkdownFileMetadata(metadata);
                this._cacheUpdater.updateByCreatedNote(
                    StdNoteId.from(rawId),
                    notePath,
                    newOutLinkIdList
                );
            } else {
                const newOutLinkIdList = this._idTranslator.fromMarkdownFileMetadata(metadata);
                this._cacheUpdater.updateByChangedNoteLinkId(
                    noteId,
                    newOutLinkIdList
                );
            }

            // ドメインイベント通知 例
            // this._eventBus.publish(new NoteLinksUpdatedEvent(noteId, outLinkIdList));
        });
    }

    private _subscribePathChanged(): void {
        this._mdFileWatcher.onPathChanged(async (newPath: MarkdownFilePath, oldPath: MarkdownFilePath) => {
            const oldNotePath = StdNotePath.tryFrom(oldPath.toString());
            if (oldNotePath === null) {
                // StdNoteじゃないのでスルー
                return;
            }

            const noteId = this._idTranslator.tryFromStdNotePath(oldNotePath);
            if (noteId === null) {
                // 基本ここに来ることはない想定だが、、、、、、
                // まだキャッシュが作成されないうちに、パス変更が起こった場合？ そんなことはまあ起こらないと思うけど、、、
                return;
            }

            const newNotePath = StdNotePath.tryFrom(newPath.toString());

            if (newNotePath === null) {
                if (!TrashedNotePath.isValidValue(newPath.toString())) {
                    console.error(`想定外のエラー. path: ${newPath}`);
                    return;
                }

                this._cacheUpdater.updateByTrashedNote(noteId);
                return;
            }

            this._cacheUpdater.updateByChangedNotePath(
                noteId,
                newNotePath
            );
        });
    }
} 