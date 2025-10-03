import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrAmountSpentDisplay({
    store,
    header = "amountSpent"
}: {
    store: StoreApi<DailyNoteState>,
    header?: string,
}) {
    const amountSpent = useStore(store, (s) => s.fmAttrAmountSpent);

    if (amountSpent === null) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {amountSpent}
        </div>
    </>)
}