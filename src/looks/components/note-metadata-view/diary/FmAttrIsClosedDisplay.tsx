import { DiaryNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrIsClosedDisplay({
    store,
    header = "isClosed"
}: {
    store: StoreApi<DiaryNoteState>,
    header?: string,
}) {
    const isClosed = useStore(store, (s) => s.fmAttrIsClosed);

    return (<>
        <div>
            {header && <span>{header}: </span>}
            {isClosed ? "true" : "false"}
        </div>
    </>)
}