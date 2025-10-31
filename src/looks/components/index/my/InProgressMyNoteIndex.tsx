import { Fragment } from "react/jsx-runtime";
import { AM } from "src/app/AppManager";
import { generateChangeModal, openModalUnresolvedLogNoteIndex } from "src/looks/modals/SimpleDisplayModal";
import { myNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";
import { ScrollableBox } from "../../common/ScrollableBox";
import { MainNav } from "../../menu/navigate/MainNav";
import { InProgressMyNoteList } from "../../searchlights/sub/InProgressMyNoteList";

export function InProgressMyNoteIndex({
    closeModal
}: {
    closeModal?: () => void;
}) {
    const changeModal = generateChangeModal(closeModal);
    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <hr />
        <a onClick={() => changeModal(openModalUnresolvedLogNoteIndex)}
        >
            unresolved log notes
        </a>
        <h1> My notes in progress</h1>
        <ScrollableBox
            height={"500px"}
        >
            <div>
                {myNoteTypeList.map(subType => {
                    return <Fragment key={subType}>
                        <InProgressMyNoteList
                            header={subType}
                            tFiles={AM.tFile.getAllMyTFilesForSubType(subType)}
                            closeModal={closeModal}
                        />
                    </Fragment>
                })}
            </div>
        </ScrollableBox>
    </>)
}