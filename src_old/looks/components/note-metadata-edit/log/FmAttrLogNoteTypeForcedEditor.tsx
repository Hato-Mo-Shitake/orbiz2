import { useState } from "react";
import { FmAttrLogNoteType } from "src/core/orb-system/services/fm-attrs/FmAttrString";
import { useFmAttrForcedEditable } from "src/looks/hooks/note-edit/useFmAttrForcedEditable";
import { isLogNoteType, logNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";
import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SelectBox } from "../../common/SelectBox";

export function FmAttrLogNoteTypeForcedEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<LogNoteState>,
    fmAttr: FmAttrLogNoteType,
}) {
    const subType = useStore(store, (s) => s.fmAttrLogNoteType);
    const [selected, setSelected] = useState<string>(fmAttr.value);
    const { newValue, handleUpdate } = useFmAttrForcedEditable(fmAttr);

    const handleClick = (subType: string) => {
        if (!isLogNoteType(subType)) {
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
                options={[...logNoteTypeList]}
            />
        </div>
    </>)
}