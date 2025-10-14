import { OTM } from "src/orbiz/managers/OrbizTFileManager";
import { ScrollableBox } from "../../common/ScrollableBox";
import { NoteList } from "../../searchlights/sub/NoteList";
import { MainNav } from "../navigate/MainNav";
import { DiaryNoteMenu } from "./DiaryNoteMenu";

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
                tFileList={OTM().getDailyTFilesByMonth(y, m)}
                closeModal={closeModal}
            />
        </ScrollableBox>
    </>)
}