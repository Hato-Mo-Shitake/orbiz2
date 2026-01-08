import { useState } from "react";
import { FmAttrMyNoteType } from "src/core/orb-system/services/fm-attrs/FmAttrString";
import { useFmAttrForcedEditable } from "src/looks/hooks/note-edit/useFmAttrForcedEditable";
import { isMyNoteType, myNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SelectBox } from "../../common/SelectBox";

export function FmAttrMyNoteTypeForcedEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<MyNoteState>,
    fmAttr: FmAttrMyNoteType,
}) {
    const subType = useStore(store, (s) => s.fmAttrMyNoteType);
    const [selected, setSelected] = useState<string>(fmAttr.value);
    const { newValue, handleUpdate } = useFmAttrForcedEditable(fmAttr);

    const handleClick = (subType: string) => {
        if (!isMyNoteType(subType)) {
            alert("invalid value.");
            return;
        }
        handleUpdate(subType);
    }

    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={() => handleClick(selected)}>更新</button>
            </h5>
            <div>current value: {subType}</div>
            <SelectBox
                value={newValue || ""}
                onChange={setSelected}
                options={[...myNoteTypeList]}
            />
        </div>
    </>)
}