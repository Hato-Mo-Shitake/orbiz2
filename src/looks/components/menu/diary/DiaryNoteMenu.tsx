import { CSSProperties } from "react";
import { generateChangeModal, openModalDailyNoteIndex } from "src/looks/modals/SimpleDisplayModal";

export function DiaryNoteMenu({
    closeModal,
    isHorizon = false,
}: {
    closeModal?: () => void,
    isHorizon?: boolean
}) {
    const changeModal = generateChangeModal(closeModal);

    const style: CSSProperties = { fontSize: "20px" };
    return (<>
        <ul style={style} className={isHorizon ? "orbiz__list--horizon" : ""}>
            <li>
                <a onClick={() => changeModal(openModalDailyNoteIndex)}>daily</a>
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