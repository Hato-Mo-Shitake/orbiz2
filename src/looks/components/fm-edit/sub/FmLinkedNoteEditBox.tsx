import { StdNote } from "src/core/domain/StdNote";
import { FmAttrLinkedNote } from "src/core/orb-system/services/fm-attrs/FmAttrLinkedNote";
import { useFmAttrEditor } from "src/looks/hooks/useFmAttrEditor";
import { StdNotePicker } from "../../common/StdNotePicker";

export function FmLinkedNoteEditBox({
    fmAttr,
}: {
    fmAttr: FmAttrLinkedNote,
}) {
    const { newValue, setNewValue, handleCommit } = useFmAttrEditor<StdNote | null>(fmAttr);

    return (
        <div className="fm-string-edit-box">
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <StdNotePicker
                note={newValue}
                onChange={setNewValue}
            />
        </div>
    )
} 