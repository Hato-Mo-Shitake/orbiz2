import { FmAttrStart } from "src/core/orb-system/services/fm-attrs/FmAttrDate";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";
import { DateTimePicker } from "../../common/DateTimePicker";

export function FmAttrStartEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<MyNoteState>,
    fmAttr: FmAttrStart,
}) {
    const start = useStore(store, (s) => s.fmAttrStart);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {start ? <DateDisplay date={start} /> : "null"}</div>
            <DateTimePicker
                value={newValue}
                onChange={setNewValue}
            />
        </div>
    </>)
}