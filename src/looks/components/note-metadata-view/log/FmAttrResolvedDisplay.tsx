import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";

export function FmAttrResolvedDisplay({
    store,
    header = "resolved"
}: {
    store: StoreApi<LogNoteState>,
    header?: string,
}) {
    const resolved = useStore(store, (s) => s.fmAttrResolved);

    if (!resolved) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            <DateDisplay
                date={resolved}
            />
        </div>
    </>)
}