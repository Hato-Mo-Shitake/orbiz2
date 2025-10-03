import { FmAttrAspect } from "src/core/orb-system/services/fm-attrs/FmAttrString";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { isMyNoteAspect, myNoteAspectList } from "src/orbits/schema/frontmatters/Aspect";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SelectBox } from "../../common/SelectBox";

export function FmAttrAspectEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<MyNoteState>,
    fmAttr: FmAttrAspect,
}) {
    const aspect = useStore(store, (s) => s.fmAttrAspect);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    const handleChange = (aspect: string) => {
        if (!isMyNoteAspect(aspect)) {
            alert("invalid value.");
            return;
        }
        setNewValue(aspect);
    }

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {aspect || "null"}</div>
            <SelectBox
                value={newValue || ""}
                onChange={handleChange}
                options={[...myNoteAspectList]}
            />
        </div>
    </>)
}