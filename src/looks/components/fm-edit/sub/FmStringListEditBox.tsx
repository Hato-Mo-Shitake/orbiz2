import { FmAttrStringList } from "src/core/orb-system/services/fm-attrs/FmAttrStringList";
import { useFmAttrEditor } from "src/looks/hooks/useFmAttrEditor";
import { EditableItemList } from "../../common/EditableItemList";

export function FmStringListEditBox({
    fmEditor,
    options,
}: {
    fmEditor: FmAttrStringList,
    options?: {
        suggestions?: string[],
        // genLabelFromValue?: (value: string) => string | null,
        // genValueFromLabel?: (label: string) => string | null,
    }
}) {
    const { newValue, setNewValue, handleCommit } = useFmAttrEditor(fmEditor);

    return (
        <div className="fm-string-list-edit-box">
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmEditor.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <EditableItemList
                labels={newValue || []}
                onChange={setNewValue}
                options={{
                    inputSuggestions: options?.suggestions || [],
                    inputPlaceholder: String(fmEditor.value),
                    // genLabelFromValue: options?.genLabelFromValue,
                    // genValueFromLabel: options?.genValueFromLabel,
                }}
            />
        </div>
    )
}