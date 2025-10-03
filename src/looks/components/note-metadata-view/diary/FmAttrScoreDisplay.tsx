import { DiaryNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrScoreDisplay({
    store,
    header = "score"
}: {
    store: StoreApi<DiaryNoteState>,
    header?: string,
}) {
    const score = useStore(store, (s) => s.fmAttrScore);

    if (score === null) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {score}
        </div>
    </>)
}