import { BaseNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrTagsDisplay({
    store,
    header = "tags"
}: {
    store: StoreApi<BaseNoteState>,
    header?: string,
}) {
    const tags = useStore(store, (s) => s.fmAttrTags);

    if (!tags?.length) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {String(tags)}
        </div>
    </>)
}