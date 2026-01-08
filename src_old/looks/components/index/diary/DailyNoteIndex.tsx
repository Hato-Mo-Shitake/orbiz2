import { Fragment } from "react/jsx-runtime";
import { AM } from "src/app/AppManager";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { generateChangeModal, openModalDailyNoteIndexByMonth } from "src/looks/modals/SimpleDisplayModal";
import { ScrollableBox } from "../../common/ScrollableBox";
import { DiaryNoteMenu } from "../../menu/diary/DiaryNoteMenu";
import { MainNav } from "../../menu/navigate/MainNav";
import { NoteList } from "../../searchlights/sub/NoteList";

export function DailyNoteIndex({
    closeModal
}: {
    closeModal?: () => void;
}) {
    const changeModal = generateChangeModal(closeModal);

    const [yStart, yEnd] = AM.diary.getExistingDailyNoteYearsBetween();
    const ymList: Record<number, number[]> = {};

    for (let y = yStart; y <= yEnd; y++) {
        const mBetween = AM.diary.getExistingDailyNoteMonthsBetween(y);
        if (!mBetween) throw new UnexpectedError();
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
                                            tFileList={AM.tFile.getDailyTFilesByMonth(y, m)}
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