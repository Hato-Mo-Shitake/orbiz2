import { StdNote } from "src/core/domain/StdNote";
import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { NoteLinkList } from "../../common/NoteLinkList";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrDailyLinkedNoteListDisplay({
    store,
    selector,
    header,
    headerWidth,
}: {
    store: StoreApi<DailyNoteState>,
    selector: (state: DailyNoteState) => StdNote[],
    header?: string,
    headerWidth?: number
}) {
    const lnList = useStore(store, selector);
    if (!lnList?.length) return null;
    return (<>
        {/* {header && <div>{header}: </div>}
        <NoteLinkList
            notes={lnList}
        /> */}
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <NoteLinkList
                notes={lnList}
            />
        </SimpleViewBox>
    </>)
}