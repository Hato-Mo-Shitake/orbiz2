import { FmAttrScore } from "src/core/orb-system/services/fm-attrs/FmAttrNumber";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { DiaryNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrScoreEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<DiaryNoteState>,
    fmAttr: FmAttrScore,
}) {
    const score = useStore(store, (s) => s.fmAttrScore);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {score}</div>
            <input
                type="number"
                placeholder={score?.toString()}
                onChange={(evt) => setNewValue(Number(evt.target.value))}
                value={newValue || ""}
                style={{ width: "80%", padding: "8px", boxSizing: "border-box" }}
            />
        </div>
    </>)
}