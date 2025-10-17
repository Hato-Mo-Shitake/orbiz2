import { FmAttrRoleKind } from "src/core/orb-system/services/fm-attrs/FmAttrString";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SelectBox } from "../../common/SelectBox";

export function FmAttrRoleKindEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<MyNoteState>,
    fmAttr: FmAttrRoleKind,
}) {
    const roleKind = useStore(store, (s) => s.fmAttrRoleKind);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    const handleChange = (roleKind: string) => {
        if (!AM.orbizSetting.roleKinds.includes(roleKind)) {
            alert("invalid value.");
            return;
        }
        setNewValue(roleKind);
    }

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {roleKind}</div>
            <SelectBox
                value={newValue || ""}
                onChange={handleChange}
                options={AM.orbizSetting.roleKinds}
            />
        </div>
    </>)
}