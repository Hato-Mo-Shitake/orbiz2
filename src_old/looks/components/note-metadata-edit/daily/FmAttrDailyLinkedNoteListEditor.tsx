import { StdNote } from "src/core/domain/StdNote";
import { FmAttrLinkedNoteList } from "src/core/orb-system/services/fm-attrs/FmAttrLinkedNoteList";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { StdNoteListPicker } from "../../common/StdNoteListPicker";

export function FmAttrDailyLinkedNoteListEditor({
    store,
    selector,
    fmAttr,
}: {
    store: StoreApi<DailyNoteState>,
    selector: (state: DailyNoteState) => StdNote[]
    fmAttr: FmAttrLinkedNoteList,
}) {
    const notes = useStore(store, selector);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable<StdNote[] | null>(fmAttr);
    const handleChange = (note: StdNote[]) => {
        setNewValue(note)
    }
    return (<>
        <div className="fm-string-list-edit-box">
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {String(notes.map(n => n.baseName)) || "null"}</div>
            <StdNoteListPicker
                noteList={newValue || []}
                onChange={handleChange}
                options={{
                    placeholder: String(notes.map(aVal => aVal.baseName)),
                }}
            />
        </div>
    </>)
}