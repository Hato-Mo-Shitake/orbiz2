import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrStatusDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<LogNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const aspect = useStore(store, (s) => s.fmAttrStatus);

    if (!aspect) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <a>
                {aspect}
            </a>
        </SimpleViewBox>
    </>)
}