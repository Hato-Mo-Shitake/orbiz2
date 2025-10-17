import { AM } from "src/app/AppManager";
import { ScrollableBox } from "../../common/ScrollableBox";
import { DiaryNoteMenu } from "../../menu/diary/DiaryNoteMenu";
import { MainNav } from "../../menu/navigate/MainNav";
import { NoteList } from "../../searchlights/sub/NoteList";

export function DailyNoteIndexByMonth({
    y,
    m,
    closeModal
}: {
    y: number,
    m: number,
    closeModal?: () => void;
}) {
    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <hr />
        <DiaryNoteMenu
            closeModal={closeModal}
            isHorizon={true}
        />
        <h1>{`${y}-${m}`} index</h1>
        <ScrollableBox
            height={"500px"}
        >
            <NoteList
                tFileList={AM.tFile.getDailyTFilesByMonth(y, m)}
                closeModal={closeModal}
            />
        </ScrollableBox>
    </>)
}