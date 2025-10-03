import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrContextDisplay({
    store,
    header = "context"
}: {
    store: StoreApi<LogNoteState>,
    header?: string,
}) {
    const context = useStore(store, (s) => s.fmAttrContext);

    if (!context) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {context}
        </div>
    </>)
}