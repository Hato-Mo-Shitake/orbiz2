import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrRankDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const rank = useStore(store, (s) => s.fmAttrRank);

    if (rank === null) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            {rank}
        </SimpleViewBox>
    </>)
}