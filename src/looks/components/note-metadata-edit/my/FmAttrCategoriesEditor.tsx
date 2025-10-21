import { AM } from "src/app/AppManager";
import { FmAttrCategories } from "src/core/orb-system/services/fm-attrs/FmAttrStringList";
import { useFmAttrEditable } from "src/looks/hooks/note-edit/useFmAttrEditable";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SelectableItemList } from "../../common/SelectableItemList";

export function FmAttrCategoriesEditor({
    store,
    fmAttr,
}: {
    store: StoreApi<MyNoteState>,
    fmAttr: FmAttrCategories,
}) {
    const categories = useStore(store, (s) => s.fmAttrCategories);
    const { newValue, setNewValue, handleCommit } = useFmAttrEditable(fmAttr);
    return (<>
        <div>
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <div>current value: {String(categories) || "null"}</div>
            <SelectableItemList
                selectedList={newValue || []}
                onChange={setNewValue}
                selections={AM.orbizSetting.categories}
            />
        </div>
    </>)
}