import { StdNoteId, StdNoteIdList, StdNotePath } from "../../../domain/std-note";

export interface StdNoteCacheUpdater {
    updateByCreatedNote(noteId: StdNoteId, notePath: StdNotePath, outLinkIdList: StdNoteIdList): Promise<void>;
    updateByTrashedNote(noteId: StdNoteId): Promise<void>;
    updateByChangedNoteLinkId(noteId: StdNoteId, newOutLinkIdList: StdNoteIdList): Promise<void>;
    updateByChangedNotePath(noteId: StdNoteId, newPath: StdNotePath): Promise<void>;
}