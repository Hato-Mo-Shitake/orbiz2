import { FmAttrStringList } from "src/core/orb-system/services/fm-attrs/FmAttrStringList";
import { useFmAttrEditor } from "src/looks/hooks/useFmAttrEditor";
import { SelectableItemList } from "../../common/SelectableItemList";

export function FmAttrSelectableList({
    fmEditor,
    selections,
    options,
}: {
    fmEditor: FmAttrStringList,
    selections: string[]
    options?: {
        suggestions?: string[],
        // genLabelFromValue?: (value: string) => string | null,
        // genValueFromLabel?: (label: string) => string | null,
    }
}) {
    const { newValue, setNewValue, handleCommit } = useFmAttrEditor(fmEditor);

    return (
        <div className="fm-selectable-list-edit-box">
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmEditor.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <SelectableItemList
                selectedList={newValue || []}
                onChange={setNewValue}
                selections={selections}
            />
        </div>
    )
}