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

export interface IStdNoteCacheMaintainer {
    build(): Promise<{
        sourceMap: StdNoteSourcesById,
        idMap: StdNoteIdsByName
    }>
    // buildSourceMap(): Promise<StdNoteSourcesById>;
    // updateSourceMap(): Promise<void>;
}