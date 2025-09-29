import { OTM } from "src/orbiz/managers/OrbizTFileManager";
import { ScrollableBox } from "../../common/ScrollableBox";
import { NoteList } from "../../searchlights/sub/NoteList";
import { MainNav } from "../navigate/MainNav";
import { DiaryNoteIndex } from "./DiaryNoteIndex";

export function DailyNoteIndexByMonth({
    y,
    m,
    closeModal
}: {
    y: number,
    m: number,
    closeModal?: () => void;
}) {
    const _handleOpenModal = (modal: { open: () => void }): () => void => {
        return () => {
            closeModal?.();
            modal.open();
        }
    }

    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <hr />
        <DiaryNoteIndex
            closeModal={closeModal}
            isHorizon={true}
        />
        <h1>{`${y}-${m}`} index</h1>
        <ScrollableBox
            height={"500px"}
        >
            <NoteList
                tFileList={OTM().getDailyTFilesByMonth(y, m)}
                closeModal={closeModal}
            />
        </ScrollableBox>
    </>)
}