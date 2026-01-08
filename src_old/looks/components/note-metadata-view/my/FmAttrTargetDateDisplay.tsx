import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrTargetDateDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const targetDate = useStore(store, (s) => s.fmAttrTargetDate);

    if (!targetDate) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <DateDisplay
                date={targetDate}
            />
        </SimpleViewBox>
    </>)
}