import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrStartDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const start = useStore(store, (s) => s.fmAttrStart);

    if (!start) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <DateDisplay
                date={start}
            />
        </SimpleViewBox>
    </>)
}