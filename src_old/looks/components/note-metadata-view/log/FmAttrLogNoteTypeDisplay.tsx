import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrLogNoteTypeDisplay({
    store,
    header = "",
    headerWidth,
}: {
    store: StoreApi<LogNoteState>
    header?: string,
    headerWidth?: number
}) {
    const subType = useStore(store, (s) => s.fmAttrLogNoteType);

    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <a>
                {subType}
            </a>
        </SimpleViewBox>
    </>)
}