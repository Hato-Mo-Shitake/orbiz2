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

/*-------------------------------*/

const handleList: TimeAutoAndIntervalHandler[] = [
    handleJudgeDateChange,
];

/*-------------------------------*/

export const EventHandlersForInterval = handleList;