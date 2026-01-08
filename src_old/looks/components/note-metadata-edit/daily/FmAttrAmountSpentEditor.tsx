import { FmAttrAmountSpent } from "src/core/orb-system/services/fm-attrs/FmAttrNumber";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrAmountSpentEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<DailyNoteState>,
    fmAttr: FmAttrAmountSpent
}) {
    const amountSpent = useStore(store, (s) => s.fmAttrAmountSpent);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {amountSpent}</div>
            <input
                type="number"
                placeholder={amountSpent?.toString()}
                onChange={(evt) => setNewValue(Number(evt.target.value))}
                value={newValue || ""}
                style={{ width: "80%", padding: "8px", boxSizing: "border-box" }}
            />
        </div>
    </>)
}