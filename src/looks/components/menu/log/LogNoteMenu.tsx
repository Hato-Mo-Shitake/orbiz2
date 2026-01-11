import { CSSProperties } from "react";
import { generateChangeModal, openModalLogNoteIndex } from "src/looks/modals/SimpleDisplayModal";
import { logNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";

export function LogNoteMenu({
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
                <a onClick={() => changeModal(openModalLogNoteIndex)}>
                    log
                </a>
                {" : "}
            </li>

            <ul style={style} className={isHorizon ? "orbiz__list--horizon" : ""}>
                {logNoteTypeList.map(subType =>
                    <li key={subType}>
                        <a onClick={() => changeModal(() => openModalLogNoteIndex(subType))}>
                            {subType}
                        </a>
                    </li>
                )}
            </ul>
        </ul>
    </>)
}