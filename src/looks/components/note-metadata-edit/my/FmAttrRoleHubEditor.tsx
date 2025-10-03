import { FmAttrRoleHub } from "src/core/orb-system/services/fm-attrs/FmAttrLinkedNote";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
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

    // const handleChange = (roleKind: string) => {
    //     if (!OSM().roleKinds.includes(roleKind)) {
    //         alert("invalid value.");
    //         return;
    //     }
    //     setNewValue(roleKind);
    // }

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {roleHub?.baseName || "null"}</div>
            <StdNotePicker
                onChange={setNewValue}
                options={{
                    defaultNote: newValue || undefined,
                    suggestions: ONM().allMyNoteNames
                }}
            />
            {/* <div>current value: {roleKind}</div> */}
            {/* <SelectBox
                value={newValue || ""}
                onChange={handleChange}
                options={OSM().roleKinds}
            /> */}
        </div>
    </>)
}