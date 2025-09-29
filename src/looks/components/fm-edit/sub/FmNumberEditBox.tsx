import { useFmAttrEditor } from "src/looks/hooks/useFmAttrEditor";
import { FmAttrEditor } from "src/orbits/contracts/fmAttr";

export function FmNumberEditBox({
    fmEditor
}: {
    fmEditor: FmAttrEditor<number>
}) {
    const { newValue, setNewValue, handleCommit } = useFmAttrEditor(fmEditor);

    const _handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(evt.target.value);
        setNewValue(value);
    }

    return (
        <div className="fm-number-edit-box">
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmEditor.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <input
                type="number"
                placeholder={fmEditor.value.toString()}
                onChange={_handleChange}
                value={newValue || ""}
                style={{ width: "80%", padding: "8px", boxSizing: "border-box" }}
            />
        </div>
    )
}