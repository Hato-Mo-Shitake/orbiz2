import { FmAttrRank } from "src/core/orb-system/services/fm-attrs/FmAttrNumber";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrRankEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<MyNoteState>,
    fmAttr: FmAttrRank,
}) {
    const rank = useStore(store, (s) => s.fmAttrRank);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {rank}</div>
            <input
                type="number"
                placeholder={rank?.toString()}
                onChange={(evt) => setNewValue(Number(evt.target.value))}
                value={newValue || ""}
                style={{ width: "80%", padding: "8px", boxSizing: "border-box" }}
            />
        </div>
    </>)
}