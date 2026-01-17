import { MarkdownFilePath } from "../../../domain/common/MarkdownFilePath.vo";
import { StdNoteId, StdNotePath } from "../../../domain/std-note";
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
                // ここに入ると、キャッシュが作成されていないノート -> 新規ノート
                // 新規キャッシュ作成処理
                // TODO: this._cacheUpdater.updateByCreatedNoteを呼ぶ。this._updateCacheByCreatedNote でもいい。
            } else {

                // トラッシュ判定は、_subscribePathChanged に任せる。

                // キャッシュ更新
                this._updateCacheByChangedMetadata(noteId, metadata);
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
                // trashed-noteドメインを使って、トラッシュ判定。
                // トラッシュは ___/trash/ のディレクトリ以下に持っていくだけの処理の想定。論理削除
                // TODO: this._cacheUpdater.updateByTrashedNoteを呼ぶ
                return;
            }

            this._cacheUpdater.updateByChangedNotePath(
                noteId,
                newNotePath
            );
        });
    }

    private _updateCacheByChangedMetadata(noteId: StdNoteId, metadata: MarkdownFileMetadata) {
        const newOutLinkIdList = this._idTranslator.fromMarkdownFileMetadata(metadata);
        this._cacheUpdater.updateByChangedNoteLinkId(
            noteId,
            newOutLinkIdList
        );
    }
} 