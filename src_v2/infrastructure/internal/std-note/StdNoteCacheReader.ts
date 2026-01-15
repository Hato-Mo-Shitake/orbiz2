import { StdNoteId } from "../../../domain/std-note";
import { StdNoteCacheValue, StdNoteSource } from "./std-note-cache.rules.ts";

export interface StdNoteCacheReader {
    cache: StdNoteCacheValue;
    sourceMap: Map<string, StdNoteSource>;
    idMap: Map<string, string>;

    findSourceById(noteId: StdNoteId): StdNoteSource | null;
    getSourceById(noteId: StdNoteId): StdNoteSource;
}