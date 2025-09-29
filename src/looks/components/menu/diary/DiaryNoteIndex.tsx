import { CSSProperties } from "react";
import { DailyNoteIndexModal } from "src/looks/modals/menu/diary/DailyNoteIndexModal";

export function DiaryNoteIndex({
    closeModal,
    isHorizon = false,
}: {
    closeModal?: () => void,
    isHorizon?: boolean
}) {
    const _handleOpenModal = (modal: { open: () => void }): () => void => {
        return () => {
            closeModal?.();
            modal.open();
        }
    }
    const style: CSSProperties = isHorizon
        ? { fontSize: "20px", display: "flex", gap: "0.3em", listStyle: "none", paddingLeft: "0" }
        : { fontSize: "20px" };
    return (<>
        <ul style={style}>
            <li>
                <a onClick={_handleOpenModal(DailyNoteIndexModal)}>daily</a>
            </li>
            <li>
                <a onClick={() => { alert("未実装") }}>weekly</a>
            </li>
            <li>
                <a onClick={() => { alert("未実装") }}>monthly</a>
            </li>
            <li>
                <a onClick={() => { alert("未実装") }}>yearly</a>
            </li>
        </ul>
    </>)
}