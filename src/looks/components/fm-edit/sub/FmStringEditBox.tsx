import { useFmAttrEditor } from "src/looks/hooks/useFmAttrEditor";
import { FmAttrEditor } from "src/orbits/contracts/fmAttr";
import { AutoSuggestInput } from "../../common/AutoSuggestInput";

export function FmStringEditBox({
    fmEditor,
    options
}: {
    fmEditor: FmAttrEditor<string>,
    options?: {
        suggestions?: string[],
        genLabelFromValue?: (value: string) => string | null,
        genValueFromLabel?: (label: string) => string | null,
    }
}) {
    const { newValue, setNewValue, handleCommit } = useFmAttrEditor(fmEditor);

    return (
        <div className="fm-string-edit-box">
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmEditor.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <AutoSuggestInput
                input={newValue || ""}
                onChange={setNewValue}
                suggestions={options?.suggestions || []}
                placeholder={fmEditor.value || ""}
            />
        </div>
    )
} 