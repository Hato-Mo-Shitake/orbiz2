import { StdNote, StdNoteId } from "../../../domain/std-note";

export interface StdNoteEventWatcher {
    onMetadataChanged(callback: (noteWithChangedMeta: StdNote) => void): void;
    onPathChanged(callback: (noteId: StdNoteId, newPath: string, oldPath: string) => void): void;
}