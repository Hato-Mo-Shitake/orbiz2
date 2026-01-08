import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrDoneDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const done = useStore(store, (s) => s.fmAttrDone);

    if (!done) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <DateDisplay
                date={done}
            />
        </SimpleViewBox>
    </>)
}