import { debugConsole } from "src/assistance/utils/debug";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";

export type TimeAutoAndIntervalHandler = [number, () => any];

/*-------------------------------*/

const handleJudgeDateChange: TimeAutoAndIntervalHandler = [
    60 * 1000,
    () => {
        debugConsole("judgeDateChange");
        ODM().judgeDateChange(new Date());
    }
];
const handleWriteDailyLogNoteIds: TimeAutoAndIntervalHandler = [
    30 * 60 * 1000,
    () => {
        debugConsole("writeDailyLogNoteIds");
        ODM().writeDailyLogNoteIds();
    }
];

/*-------------------------------*/

const handleList: TimeAutoAndIntervalHandler[] = [
    handleJudgeDateChange,
    handleWriteDailyLogNoteIds
];

/*-------------------------------*/

export const EventHandlersForInterval = handleList;