import { AM } from "src/app/AppManager";
import { debugConsole } from "src/assistance/utils/debug";

export type TimeAutoAndIntervalHandler = [number, () => any];

/*-------------------------------*/

const handleJudgeDateChange: TimeAutoAndIntervalHandler = [
    60 * 1000,
    () => {
        debugConsole("judgeDateChange");
        AM.diary.judgeDateChange(new Date());
    }
];
const handleWriteDailyLogNoteIds: TimeAutoAndIntervalHandler = [
    30 * 60 * 1000,
    () => {
        debugConsole("writeDailyLogNoteIds");
        AM.diary.writeDailyLogNoteIds();
    }
];

/*-------------------------------*/

const handleList: TimeAutoAndIntervalHandler[] = [
    handleJudgeDateChange,
    handleWriteDailyLogNoteIds
];

/*-------------------------------*/

export const EventHandlersForInterval = handleList;