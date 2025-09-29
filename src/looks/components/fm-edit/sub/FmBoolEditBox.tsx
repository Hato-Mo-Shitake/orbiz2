import * as React from "react";
import { useFmAttrEditor } from "src/looks/hooks/useFmAttrEditor";
import { FmAttrEditor } from "src/orbits/contracts/fmAttr";

export function FmBoolEditBox({
    fmEditor
}: {
    fmEditor: FmAttrEditor<boolean>
}) {
    const { newValue, setNewValue, handleCommit } = useFmAttrEditor(fmEditor);

    const _handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.checked;
        setNewValue(value);
    }

    return (
        <div className="fm-number-edit-box">
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmEditor.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <input
                type="checkbox"
                onChange={_handleChange}
                checked={newValue || false}
                value="1"
            />
        </div>
    )
}