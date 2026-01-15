import { StdNote, StdNoteId, StdNoteIdList, StdNotePath } from "../../../domain/std-note";

export interface StdNoteCacheUpdater {
    updateByCreatedNote(note: StdNote): Promise<void>;
    updateByTrashedNote(note: StdNote): Promise<void>;
    updateByChangedNoteLinkId(noteId: StdNoteId, newOutLinkIds: StdNoteIdList): Promise<void>;
    updateByChangedNotePath(noteId: StdNoteId, newPath: StdNotePath): Promise<void>;
}