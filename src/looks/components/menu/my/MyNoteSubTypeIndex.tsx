import { MyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { OTM } from "src/orbiz/managers/OrbizTFileManager";
import { ScrollableBox } from "../../common/ScrollableBox";
import { NoteList } from "../../searchlights/sub/NoteList";
import { MainNav } from "../navigate/MainNav";
import { MyNoteIndex } from "./MyNoteIndex";

export function MyNoteSubTypeIndex({
    subType,
    closeModal
}: {
    subType: MyNoteType,
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
        <MyNoteIndex isHorizon={true} closeModal={closeModal} />
        <h1>{subType} index</h1>
        <ScrollableBox
            height={"500px"}
        >
            <NoteList
                tFileList={OTM().getAllMyTFilesForSubType(subType)}
                beginningPath={OAM().rootPath}
                cutSlug={`〈-${subType}-〉`}
                closeModal={closeModal}
            />
        </ScrollableBox>
    </>)
}