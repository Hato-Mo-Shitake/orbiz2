import { AM } from "src/app/AppManager";
import { MyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { ScrollableBox } from "../../common/ScrollableBox";
import { MyNoteMenu } from "../../menu/my/MyNoteMenu";
import { MainNav } from "../../menu/navigate/MainNav";
import { NoteList } from "../../searchlights/sub/NoteList";


export function MyNoteIndex({
    subType,
    closeModal
}: {
    subType?: MyNoteType,
    closeModal?: () => void;
}) {
    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <hr />
        <MyNoteMenu isHorizon={true} closeModal={closeModal} />
        <h1>{subType || "my note"} index</h1>
        <ScrollableBox
            height={"500px"}
        >
            <NoteList
                tFileList={subType ? AM.tFile.getAllMyTFilesForSubType(subType) : AM.tFile.allMyTFiles}
                // beginningPath={OAM().rootPath}
                beginningPath={AM.orbiz.rootPath}
                cutSlug={`〈-${subType}-〉`}
                closeModal={closeModal}
            />
        </ScrollableBox>
    </>)
}