import { LogNoteIndexModal } from "src/looks/modals/menu/log/LogNoteIndexModal";
import { MainMenuModal } from "src/looks/modals/menu/MainMenuModal";
import { MyNoteIndexModal } from "src/looks/modals/menu/my/MyNoteIndexModal";
import { NoteSearchlightModal } from "src/looks/modals/searchlights/NoteSearchlightModal";
import { SettingsIndexModal } from "src/looks/modals/settings/SettingsIndexModal";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { OVM } from "src/orbiz/managers/OrbizViewManager";

export function MainNav({
    closeModal,
}: {
    closeModal?: () => void
}) {
    const _handleOpenModal = (modal: { open: () => void }): () => void => {
        return () => {
            closeModal?.();
            modal.open();
        }
    }

    const handleOpenTodayNote = async () => {
        closeModal?.();
        await OVM().openNote(ODM().todayNoteOrb.note, false);
    }

    return (<>
        <div>
            <div style={{ fontSize: "18px" }}>today: <a onClick={handleOpenTodayNote}>{ODM().getToday("Y-m-d_D")}</a></div>
            <div><a onClick={_handleOpenModal(MainMenuModal)} style={{ fontSize: "20px" }}>main menu</a></div>
            <ul style={{ fontSize: "18px", display: "flex", gap: "0.3em", listStyle: "none", paddingLeft: "15px" }}>
                <li><a onClick={_handleOpenModal(NoteSearchlightModal)}>searchlight</a></li>
                <li><a onClick={_handleOpenModal(MyNoteIndexModal)}>my</a></li>
                <li><a onClick={_handleOpenModal(LogNoteIndexModal)}>log</a></li>
                <li><a onClick={_handleOpenModal(SettingsIndexModal)}>settings</a></li>
            </ul>
        </div>
    </>)
}