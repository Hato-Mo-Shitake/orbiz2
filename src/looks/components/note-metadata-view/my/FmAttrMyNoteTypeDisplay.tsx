import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrMyNoteTypeDisplay({
    store,
    header = "",
    headerWidth,
}: {
    store: StoreApi<MyNoteState>
    header?: string,
    headerWidth?: number
}) {
    const subType = useStore(store, (s) => s.fmAttrMyNoteType);

    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <a>
                {subType}
            </a>
        </SimpleViewBox>
    </>)
}