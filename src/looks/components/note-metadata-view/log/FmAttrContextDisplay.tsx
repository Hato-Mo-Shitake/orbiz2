import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrContextDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<LogNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const context = useStore(store, (s) => s.fmAttrContext);

    if (!context) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            {context}
        </SimpleViewBox>
    </>)
}