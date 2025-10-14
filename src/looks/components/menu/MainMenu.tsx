import { generateChangeModal, openModalNoteSearchlight, openModalSettingsIndex } from "src/looks/modals/SimpleDisplayModal";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { OVM } from "src/orbiz/managers/OrbizViewManager";
import { DiaryNoteMenu } from "./diary/DiaryNoteMenu";
import { LogNoteMenu } from "./log/LogNoteMenu";
import { MyNoteMenu } from "./my/MyNoteMenu";

export function MainMenu({
    closeModal
}: {
    closeModal?: () => void;
}) {
    const changeModal = generateChangeModal(closeModal);

    const handleOpenTodayNote = async () => {
        closeModal?.();
        await OVM().openNote(ODM().todayNoteOrb.note, false);
    }

    return (<>
        <div>
            today: <a onClick={handleOpenTodayNote}>{ODM().getToday("Y-m-d_D")}</a>

            <h2>Note Index</h2>

            <MyNoteMenu
                closeModal={closeModal}
            />
            <LogNoteMenu
                closeModal={closeModal}
            />
            <DiaryNoteMenu
                closeModal={closeModal}
            />

            <h2>Searchlights</h2>
            <ul style={{ fontSize: "20px" }}>
                <li >
                    <a onClick={() => changeModal(openModalNoteSearchlight)}
                    >
                        Note
                    </a>
                </li>
            </ul>

            <h2>Settings</h2>
            <ul style={{ fontSize: "20px" }}>
                <li><a onClick={() => changeModal(openModalSettingsIndex)}>Index</a></li>
            </ul>
        </div>
    </>)
}