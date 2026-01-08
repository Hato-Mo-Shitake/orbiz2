import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrResolvedDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<LogNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const resolved = useStore(store, (s) => s.fmAttrResolved);

    if (!resolved) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <DateDisplay
                date={resolved}
            />
        </SimpleViewBox>
    </>)
}