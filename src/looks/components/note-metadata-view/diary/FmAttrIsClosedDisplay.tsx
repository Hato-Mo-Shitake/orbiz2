import { DiaryNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrIsClosedDisplay({
    store,
    header = "",
    headerWidth,
}: {
    store: StoreApi<DiaryNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const isClosed = useStore(store, (s) => s.fmAttrIsClosed);

    return (<>
        {/* <div>
            {header && <span>{header}: </span>}
            {isClosed ? "true" : "false"}
        </div> */}
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            {isClosed ? "true" : "false"}
        </SimpleViewBox>
    </>)
}