import { AM } from "src/app/AppManager";
import { generateChangeModal, openModalInProgressMyNoteIndex, openModalNoteSearchlight, openModalSettingsIndex, openModalUnresolvedLogNoteIndex } from "src/looks/modals/SimpleDisplayModal";
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
        await AM.looks.openNote(AM.diary.todayNoteOrb.note, false);
    }

    return (<>
        <div>
            today: <a onClick={handleOpenTodayNote}>{AM.diary.getToday("Y-m-d_D")}</a>

            <h2>To Check</h2>
            <ul style={{ fontSize: "20px" }}>
                <li >
                    <a onClick={() => changeModal(openModalUnresolvedLogNoteIndex)}
                    >
                        unresolved log notes
                    </a>
                </li>
                <li >
                    <a onClick={() => changeModal(openModalInProgressMyNoteIndex)}
                    >
                        my notes in progress
                    </a>
                </li>
            </ul>
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
                        note
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