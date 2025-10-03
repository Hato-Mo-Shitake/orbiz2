import { StdNote } from "src/core/domain/StdNote";
import { StdNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { NoteLinkList } from "../../common/NoteLinkList";

export function FmAttrLinkedNoteListDisplay({
    store,
    selector,
    header = "",
}: {
    store: StoreApi<StdNoteState>,
    selector: (state: StdNoteState) => StdNote[],
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