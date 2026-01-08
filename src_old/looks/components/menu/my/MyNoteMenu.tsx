import { CSSProperties } from "react";
import { generateChangeModal, openModalMyNoteIndex } from "src/looks/modals/SimpleDisplayModal";
import { myNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";

export function MyNoteMenu({
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
                <a onClick={() => changeModal(openModalMyNoteIndex)}>
                    my
                </a>
                {" : "}
            </li>

            <ul style={style} className={isHorizon ? "orbiz__list--horizon" : ""}>
                {myNoteTypeList.map(subType =>
                    <li key={subType}>
                        <a onClick={() => changeModal(() => openModalMyNoteIndex(subType))}>
                            {subType}
                        </a>
                    </li>
                )}
            </ul>
        </ul>
    </>)
}