import { CSSProperties } from "react";
import { MyNoteSubTypeIndexModal } from "src/looks/modals/menu/my/MyNoteSubTypeIndexModal";
import { MyNoteType, myNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";

export function MyNoteIndex({
    closeModal,
    isHorizon = false,
}: {
    closeModal?: () => void,
    isHorizon?: boolean
}) {
    const _handleOpenSubTypeIndexModal = (subType: MyNoteType) => {
        closeModal?.();
        MyNoteSubTypeIndexModal.open(subType);
    }
    const style: CSSProperties = isHorizon
        ? { fontSize: "20px", display: "flex", gap: "0.3em", listStyle: "none", paddingLeft: "0" }
        : { fontSize: "20px" };
    return (<>
        <ul style={style}>
            {myNoteTypeList.map(subType =>
                <li key={subType}>
                    <a onClick={() => _handleOpenSubTypeIndexModal(subType)}>
                        {subType}
                    </a>
                </li>
            )}
        </ul>
    </>)
}