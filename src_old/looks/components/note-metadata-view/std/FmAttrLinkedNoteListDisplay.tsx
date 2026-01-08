import { StdNote } from "src/core/domain/StdNote";
import { StdNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { NoteLinkList } from "../../common/NoteLinkList";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrLinkedNoteListDisplay({
    store,
    selector,
    header,
    headerWidth,
}: {
    store: StoreApi<StdNoteState>,
    selector: (state: StdNoteState) => StdNote[],
    header?: string,
    headerWidth?: number
}) {
    const lnList = useStore(store, selector);
    if (!lnList?.length) return null;

    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <NoteLinkList
                notes={lnList}
            />
        </SimpleViewBox>
    </>)
}