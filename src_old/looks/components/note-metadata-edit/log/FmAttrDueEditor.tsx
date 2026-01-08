import { FmAttrDue } from "src/core/orb-system/services/fm-attrs/FmAttrDate";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";
import { DateTimePicker } from "../../common/DateTimePicker";

export function FmAttrDueEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<LogNoteState>,
    fmAttr: FmAttrDue,
}) {
    const due = useStore(store, (s) => s.fmAttrDue);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {due ? <DateDisplay date={due} /> : "null"}</div>
            <DateTimePicker
                value={newValue}
                onChange={setNewValue}
            />
        </div>
    </>)
}