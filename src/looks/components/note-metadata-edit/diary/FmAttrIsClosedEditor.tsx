import { FmAttrIsClosed } from "src/core/orb-system/services/fm-attrs/FmAttrBoolean";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { DiaryNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrIsClosedEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<DiaryNoteState>,
    fmAttr: FmAttrIsClosed,
}) {
    const isClosed = useStore(store, (s) => s.fmAttrIsClosed);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {isClosed ? "true" : "false"}</div>
            <input
                // style={{ width: "80%", padding: "8px", boxSizing: "border-box" }}
                type="checkbox"
                checked={Boolean(newValue)}
                value={1}
                onChange={(evt) => setNewValue(evt.target.checked)}
            />
        </div>
    </>)
}