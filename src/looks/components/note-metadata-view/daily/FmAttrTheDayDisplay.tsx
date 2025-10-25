import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { DateDisplay } from "../../common/DateDisplay";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrTheDayDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<DailyNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const theDay = useStore(store, (s) => s.fmAttrTheDay);

    if (!theDay) return null;
    return (<>
        <div>
            {/* {header && <span>{header}: </span>}
            <DateDisplay
                date={theDay}
            /> */}

            <SimpleViewBox header={header} headerWidth={headerWidth}>
                <DateDisplay
                    date={theDay}
                />
            </SimpleViewBox>
        </div>
    </>)
}