import { FmAttrContext } from "src/core/orb-system/services/fm-attrs/FmAttrString";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrContextEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<LogNoteState>,
    fmAttr: FmAttrContext,
}) {
    const context = useStore(store, (s) => s.fmAttrContext);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {context || "null"}</div>
            <input
                style={{ width: "80%", padding: "8px", boxSizing: "border-box" }}
                value={newValue || ""}
                onChange={(evt) => setNewValue(evt.target.value)}
                placeholder={context || ""}
            />
        </div>
    </>)
}