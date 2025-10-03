import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrStatusDisplay({
    store,
    header = "status"
}: {
    store: StoreApi<LogNoteState>,
    header?: string,
}) {
    const aspect = useStore(store, (s) => s.fmAttrStatus);

    if (!aspect) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {aspect}
        </div>
    </>)
}