import { CSSProperties } from "react";
import { LogNoteSubTypeIndexModal } from "src/looks/modals/menu/log/LogNoteSubTypeIndexModal";
import { LogNoteType, logNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";

export function LogNoteIndex({
    closeModal,
    isHorizon = false,
}: {
    closeModal?: () => void,
    isHorizon?: boolean
}) {
    const _handleOpenLogSubTypeIndexModal = (subType: LogNoteType) => {
        closeModal?.();
        LogNoteSubTypeIndexModal.open(subType);
    }
    const style: CSSProperties = isHorizon
        ? { fontSize: "20px", display: "flex", gap: "0.3em", listStyle: "none", paddingLeft: "0" }
        : { fontSize: "20px" };
    return (<>
        <ul style={style}>
            {logNoteTypeList.map(subType =>
                <li key={subType}>
                    <a onClick={() => _handleOpenLogSubTypeIndexModal(subType)}>
                        {subType}
                    </a>
                </li>
            )}
        </ul>
    </>)
}