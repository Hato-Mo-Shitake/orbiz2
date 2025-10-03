import { FmAttrTemplateDone } from "src/core/orb-system/services/fm-attrs/FmAttrStringList";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { EditableItemList } from "../../common/EditableItemList";

export function FmAttrTemplateDoneEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<DailyNoteState>,
    fmAttr: FmAttrTemplateDone,
}) {
    const templateDone = useStore(store, (s) => s.fmAttrTemplateDone);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);
    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {String(templateDone) || "null"}</div>
            <EditableItemList
                labels={newValue || []}
                onChange={setNewValue}
                options={{
                    inputPlaceholder: String(templateDone),
                }}
            />
        </div>
    </>)
}