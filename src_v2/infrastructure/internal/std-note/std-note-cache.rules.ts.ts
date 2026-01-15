import { StdNoteCacheInitializer } from "./StdNoteCacheInitializer";
import { StdNoteCacheReader } from "./StdNoteCacheReader";
import { StdNoteCacheUpdater } from "./StdNoteCacheUpdater";

export type StdNoteSource = {
    id: string
    path: string
    inLinkIds: Set<string>,
    outLinkIds: Set<string>,
}

/**
 * key: noteId
 * value: StdNoteSource
 */
export type StdNoteSourcesById = Map<string, StdNoteSource>;

export type StdNoteIdsByName = Map<string, string>;

export type StdNoteCacheValue = {
    sourceMap: StdNoteSourcesById,
    idMap: StdNoteIdsByName
};

export type StdNoteCache = StdNoteCacheInitializer & StdNoteCacheReader & StdNoteCacheUpdater;