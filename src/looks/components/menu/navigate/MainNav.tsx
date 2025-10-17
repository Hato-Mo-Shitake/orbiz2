import { AM } from "src/app/AppManager";
import { generateChangeModal, openModalDailyNoteIndex, openModalLogNoteIndex, openModalMainMenu, openModalMyNoteIndex, openModalNoteSearchlight, openModalSettingsIndex } from "src/looks/modals/SimpleDisplayModal";

export function MainNav({
    closeModal,
}: {
    closeModal?: () => void
}) {
    const changeModal = generateChangeModal(closeModal!);

    const handleOpenTodayNote = async () => {
        closeModal?.();
        await AM.looks.openNote(AM.diary.todayNoteOrb.note, false);
    }

    return (<>
        <div>
            <div style={{ fontSize: "18px" }}>today: <a onClick={handleOpenTodayNote}>{AM.diary.getToday("Y-m-d_D")}</a></div>
            <hr />
            <div><a onClick={() => changeModal(openModalMainMenu)} style={{ fontSize: "20px" }}>main menu</a></div>
            <ul style={{ fontSize: "18px" }} className="orbiz__list--horizon" >
                <li><a onClick={() => changeModal(openModalNoteSearchlight)}>searchlight</a></li>
                <li><a onClick={() => changeModal(openModalMyNoteIndex)}>my</a></li>
                <li><a onClick={() => changeModal(openModalLogNoteIndex)}>log</a></li>
                <li><a onClick={() => changeModal(openModalDailyNoteIndex)}>daily</a></li>
                <li><a onClick={() => changeModal(openModalSettingsIndex)}>settings</a></li>
            </ul>
        </div>
    </>)
}