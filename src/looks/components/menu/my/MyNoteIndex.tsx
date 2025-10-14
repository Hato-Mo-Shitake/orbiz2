import { MyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { OTM } from "src/orbiz/managers/OrbizTFileManager";
import { ScrollableBox } from "../../common/ScrollableBox";
import { NoteList } from "../../searchlights/sub/NoteList";
import { MainNav } from "../navigate/MainNav";
import { MyNoteMenu } from "./MyNoteMenu";


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
                tFileList={subType ? OTM().getAllMyTFilesForSubType(subType) : OTM().allMyTFiles}
                beginningPath={OAM().rootPath}
                cutSlug={`〈-${subType}-〉`}
                closeModal={closeModal}
            />
        </ScrollableBox>
    </>)
}