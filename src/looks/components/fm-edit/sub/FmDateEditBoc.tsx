import { useFmAttrEditor } from "src/looks/hooks/useFmAttrEditor";
import { FmAttrEditor } from "src/orbits/contracts/fmAttr";
import { DateTimePicker } from "../../common/DateTimePicker";

export function FmDateEditBox({
    fmEditor,
}: {
    fmEditor: FmAttrEditor<Date | null>,
}) {
    const { newValue, setNewValue, handleCommit } = useFmAttrEditor(fmEditor);

    return (
        <div className="fm-string-edit-box">
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmEditor.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <DateTimePicker
                value={newValue}
                onChange={setNewValue}
            />
        </div>
    )
} 