import { useFmAttrEditor } from "src/looks/hooks/useFmAttrEditor";
import { FmAttrEditor } from "src/orbits/contracts/fmAttr";
import { SelectBox } from "../../common/SelectBox";

type Option = {
    label?: string;
    value: string;
};
export function FmAttrSelectBox({
    fmEditor,
    options,
}: {
    fmEditor: FmAttrEditor<any>,
    options: Option[] | string[],
}) {
    const { newValue, setNewValue, handleCommit } = useFmAttrEditor(fmEditor);

    return (
        <div className="fm-string-edit-box">
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmEditor.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <SelectBox
                value={newValue}
                onChange={setNewValue}
                options={options}
            />
            {/* <AutoSuggestInput
                input={newValue || ""}
                onChange={setNewValue}
                suggestions={options?.suggestions || []}
                placeholder={fmEditor.value || ""}
            /> */}
        </div>
    )
} 