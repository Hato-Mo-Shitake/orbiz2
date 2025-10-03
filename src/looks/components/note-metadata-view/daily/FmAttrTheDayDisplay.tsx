import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";

export function FmAttrTheDayDisplay({
    store,
    header = "theDay"
}: {
    store: StoreApi<DailyNoteState>,
    header?: string,
}) {
    const theDay = useStore(store, (s) => s.fmAttrTheDay);

    if (!theDay) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            <DateDisplay
                date={theDay}
            />
        </div>
    </>)
}