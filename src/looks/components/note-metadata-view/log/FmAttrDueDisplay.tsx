import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";

export function FmAttrDueDisplay({
    store,
    header = "due"
}: {
    store: StoreApi<LogNoteState>,
    header?: string,
}) {
    const due = useStore(store, (s) => s.fmAttrDue);

    if (!due) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            <DateDisplay
                date={due}
            />
        </div>
    </>)
}