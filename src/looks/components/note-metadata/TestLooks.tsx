import { StdNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function TestLooks({ store }: { store: StoreApi<StdNoteState> }) {
    const tags = useStore(store, (s) => s.fmAttrTags);
    const iLinkIds = useStore(store, (s) => s.inLinkIds);

    return (<>
        <ul>
            {tags.map(tag =>
                <li key={tag}>{tag}</li>
            )}
        </ul>
        <ul>
            {iLinkIds.map(id =>
                <li key={id}>{id}</li>
            )}
        </ul>
    </>)
}