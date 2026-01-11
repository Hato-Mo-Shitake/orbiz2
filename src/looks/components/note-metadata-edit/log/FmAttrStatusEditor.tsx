import { FmAttrStatus } from "src/core/orb-system/services/fm-attrs/FmAttrString";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { isLogNoteStatus, logNoteStatusList } from "src/orbits/schema/frontmatters/Status";
import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SelectBox } from "../../common/SelectBox";

export function FmAttrStatusEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<LogNoteState>,
    fmAttr: FmAttrStatus,
}) {
    const aspect = useStore(store, (s) => s.fmAttrStatus);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);

    const handleChange = (status: string) => {
        if (!isLogNoteStatus(status)) {
            alert("invalid value.");
            return;
        }
        setNewValue(status);
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
                options={[...logNoteStatusList]}
            />
        </div>
    </>)
}