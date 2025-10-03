import { FmAttrTheDay } from "src/core/orb-system/services/fm-attrs/FmAttrDate";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";
import { DateTimePicker } from "../../common/DateTimePicker";

export function FmAttrTheDayEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<DailyNoteState>,
    fmAttr: FmAttrTheDay,
}) {
    const theDay = useStore(store, (s) => s.fmAttrTheDay);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {theDay ? <DateDisplay date={theDay} /> : "null"}</div>
            <DateTimePicker
                value={newValue}
                onChange={setNewValue}
            />
        </div>
    </>)
}