import { Fragment } from "react/jsx-runtime";
import { AM } from "src/app/AppManager";
import { generateChangeModal, openModalInProgressMyNoteIndex } from "src/looks/modals/SimpleDisplayModal";
import { logNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";
import { ScrollableBox } from "../../common/ScrollableBox";
import { MainNav } from "../../menu/navigate/MainNav";
import { UnresolvedLogNoteList } from "../../searchlights/sub/UnresolvedLogNoteList";

export function UnresolvedLogNoteIndex({
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
        <a onClick={() => changeModal(openModalInProgressMyNoteIndex)}
        >
            my notes in progress
        </a>
        <h1>Unresolved log note list</h1>
        <ScrollableBox
            height={"500px"}
        >
            <div>
                {logNoteTypeList.map(subType => {
                    return <Fragment key={subType}>
                        <UnresolvedLogNoteList
                            header={subType}
                            tFiles={AM.tFile.getAllLogTFilesForSubType(subType)}
                            closeModal={closeModal}
                        />
                    </Fragment>
                })}
            </div>
        </ScrollableBox>
    </>)
}