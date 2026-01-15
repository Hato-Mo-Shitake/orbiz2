import { StdNote, StdNoteId, StdNoteIdList, StdNotePath } from "../../../domain/std-note";

export interface StdNoteCacheMaintainer {
    build(): Promise<void>;

    // これで、MarkdownFileMetadataを受け取るのは果たしてどうなのか。
    // ->> ここでこいつがイベントハンドラーの構造に忖度するのは絶対に違う
    // update(path: string, metadata: MarkdownFileMetadata): void;

    updateByCreatedNote(note: StdNote): Promise<void>;
    updateByTrashedNote(note: StdNote): Promise<void>;
    // updateByChangedNoteMetadata(note: StdNote): Promise<void>;
    updateByChangedNoteLinkId(noteId: StdNoteId, newOutLinkIds: StdNoteIdList): Promise<void>;
    updateByChangedNotePath(noteId: StdNoteId, newPath: StdNotePath): Promise<void>;
}