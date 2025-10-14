import { Fragment } from "react/jsx-runtime";
import { generateChangeModal, openModalDailyNoteIndexByMonth } from "src/looks/modals/SimpleDisplayModal";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { OTM } from "src/orbiz/managers/OrbizTFileManager";
import { ScrollableBox } from "../../common/ScrollableBox";
import { NoteList } from "../../searchlights/sub/NoteList";
import { MainNav } from "../navigate/MainNav";
import { DiaryNoteMenu } from "./DiaryNoteMenu";

export function DailyNoteIndex({
    closeModal
}: {
    closeModal?: () => void;
}) {
    const changeModal = generateChangeModal(closeModal);

    const [yStart, yEnd] = ODM().getExistingDailyNoteYearsBetween();
    const ymList: Record<number, number[]> = {};

    for (let y = yStart; y <= yEnd; y++) {
        const mBetween = ODM().getExistingDailyNoteMonthsBetween(y);
        if (!mBetween) OEM.throwUnexpectedError();
        ymList[y] = [];
        for (let m = mBetween[0]; m <= mBetween[1]; m++) {
            ymList[y].push(m);
        }

    }

    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <hr />
        <DiaryNoteMenu
            closeModal={closeModal}
            isHorizon={true}
        />
        <h1>daily index</h1>
        <ScrollableBox
            height={"500px"}
        >
            <ul>
                {Object.entries(ymList).map(([_y, _mList]) => {
                    const y = _y as any as number;
                    const mList = _mList as any as number[];
                    return (<Fragment key={y}>
                        <li>
                            {y}
                            <ul>
                                {mList.map(m =>
                                    <li key={`${y}-${m}`}>
                                        <a onClick={() => {
                                            changeModal(() => openModalDailyNoteIndexByMonth(y, m))
                                        }}>
                                            {`${y}-${m}`}
                                        </a>
                                        <NoteList
                                            tFileList={OTM().getDailyTFilesByMonth(y, m)}
                                            closeModal={closeModal}
                                        />
                                    </li>
                                )}
                            </ul>
                        </li>
                    </Fragment>)
                })}
            </ul>

        </ScrollableBox>
    </>)
}