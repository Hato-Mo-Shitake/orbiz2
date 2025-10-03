import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrRankDisplay({
    store,
    header = "rank"
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
}) {
    const rank = useStore(store, (s) => s.fmAttrRank);

    if (rank === null) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {rank}
        </div>
    </>)
}