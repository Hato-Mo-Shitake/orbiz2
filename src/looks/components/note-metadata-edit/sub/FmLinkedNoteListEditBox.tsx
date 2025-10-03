import { StdNote } from "src/core/domain/StdNote";
import { FmAttrLinkedNoteList } from "src/core/orb-system/services/fm-attrs/FmAttrLinkedNoteList";
import { useFmAttrEditor } from "src/looks/hooks/useFmAttrEditor";
import { StdNoteListPicker } from "../../common/StdNoteListPicker";

export function FmLinkedNoteListEditBox({
    fmAttr,
}: {
    fmAttr: FmAttrLinkedNoteList,
}) {
    const { newValue, setNewValue, handleCommit } = useFmAttrEditor<StdNote[]>(fmAttr);

    return (
        <div className="fm-string-list-edit-box">
            <h5 style={{ display: "flex", gap: "0.5em" }}>
                {fmAttr.fmKey}
                <button onClick={handleCommit}>更新</button>
            </h5>
            <StdNoteListPicker
                noteList={newValue || []}
                onChange={setNewValue}
                options={{
                    placeholder: String(fmAttr.value.map(aVal => aVal.baseName)),
                }}
            />
        </div>
    )
}