import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrDueDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<LogNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const due = useStore(store, (s) => s.fmAttrDue);

    if (!due) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <DateDisplay
                date={due}
            />
        </SimpleViewBox>
    </>)
}