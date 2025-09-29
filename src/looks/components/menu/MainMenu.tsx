import { DiaryNoteIndexModal } from "src/looks/modals/menu/diary/DiaryNoteIndexModal";
import { LogNoteIndexModal } from "src/looks/modals/menu/log/LogNoteIndexModal";
import { MyNoteIndexModal } from "src/looks/modals/menu/my/MyNoteIndexModal";
import { NoteSearchlightModal } from "src/looks/modals/searchlights/NoteSearchlightModal";
import { SettingsIndexModal } from "src/looks/modals/settings/SettingsIndexModal";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { OVM } from "src/orbiz/managers/OrbizViewManager";
import { DiaryNoteIndex } from "./diary/DiaryNoteIndex";
import { LogNoteIndex } from "./log/LogNoteIndex";
import { MyNoteIndex } from "./my/MyNoteIndex";

export function MainMenu({
    closeModal
}: {
    closeModal: () => void;
}) {

    const _handleOpenModal = (modal: { open: () => void }): () => void => {
        return () => {
            closeModal();
            modal.open();
        }
    }

    const handleOpenTodayNote = async () => {
        closeModal();
        await OVM().openNote(ODM().todayNoteOrb.note, false);
    }

    return (<>
        <div>
            today: <a onClick={handleOpenTodayNote}>{ODM().getToday("Y-m-d_D")}</a>

            <h2>Note Index</h2>
            <ul style={{ fontSize: "22px" }}>
                <li>
                    <a onClick={_handleOpenModal(LogNoteIndexModal)}>Log</a>
                    <LogNoteIndex
                        closeModal={closeModal}
                    />
                </li>
                <li>
                    <a onClick={_handleOpenModal(MyNoteIndexModal)}>My</a>
                    <MyNoteIndex
                        closeModal={closeModal}
                    />
                </li>
                <li>
                    <a onClick={_handleOpenModal(DiaryNoteIndexModal)}>Diary</a>
                    <DiaryNoteIndex
                        closeModal={closeModal}
                    />
                </li>
            </ul>

            <h2>Searchlights</h2>
            <ul style={{ fontSize: "22px" }}>
                <li >
                    <a onClick={_handleOpenModal(NoteSearchlightModal)}
                    >
                        Note
                    </a>
                </li>
            </ul>

            <h2>Settings</h2>
            <ul style={{ fontSize: "22px" }}>
                <li><a onClick={_handleOpenModal(SettingsIndexModal)}>Index</a></li>
            </ul>
        </div>
    </>)
    return (<>
        <h1>Main Menu</h1>

    </>)
}