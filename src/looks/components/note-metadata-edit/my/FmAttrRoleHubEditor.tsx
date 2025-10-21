import { AM } from "src/app/AppManager";
import { isMyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { FmAttrRoleHub } from "src/core/orb-system/services/fm-attrs/FmAttrLinkedNote";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { StdNotePicker } from "../../common/StdNotePicker";

export function FmAttrRoleHubEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<MyNoteState>,
    fmAttr: FmAttrRoleHub,
}) {
    const roleHub = useStore(store, (s) => s.fmAttrRoleHub);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    const handleChange = (note: StdNote) => {
        if (!isMyNote(note)) {
            alert("not my note.");
            return;
        }
        setNewValue(note);
    }

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {roleHub?.baseName || "null"}</div>
            <StdNotePicker
                onChange={handleChange}
                options={{
                    defaultNote: newValue || undefined,
                    suggestions: AM.note.allMyNoteNames
                }}
            />
        </div>
    </>)
}