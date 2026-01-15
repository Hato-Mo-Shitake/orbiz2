import { StdNoteCacheMaintainer } from "./StdNoteCacheMaintainer";
import { StdNoteCacheReader } from "./StdNoteCacheReader";

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

export type StdNoteCache = {
    sourceMap: StdNoteSourcesById,
    idMap: StdNoteIdsByName
};

export type StdNoteCacheManager = StdNoteCacheReader & StdNoteCacheMaintainer;