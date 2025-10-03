import { StdNote } from "src/core/domain/StdNote";
import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { NoteLinkList } from "../../common/NoteLinkList";

export function FmAttrDailyLinkedNoteListDisplay({
    store,
    selector,
    header = "",
}: {
    store: StoreApi<DailyNoteState>,
    selector: (state: DailyNoteState) => StdNote[],
    header?: string
}) {
    const lnList = useStore(store, selector);
    if (!lnList?.length) return null;
    return (<>
        {header && <div>{header}: </div>}
        <NoteLinkList
            notes={lnList}
        />
    </>)
}