import { AM } from "src/app/AppManager";
import { shitDate } from "src/assistance/utils/date";
import { DailyNoteViewer } from "src/core/orb-system/services/viewers/DailyNoteViewer";
import { CreateLogNoteButton } from "../../common-orbiz/CreateLogNoteButton";
import { CreateMyNoteButton } from "../../common-orbiz/CreateMyNoteButton";
import { DateDisplay } from "../../common/DateDisplay";
import { NoteTopSectionHeader } from "../common/header";

export function DailyNoteTopSectionDefault({ viewer }: { viewer: DailyNoteViewer }) {

    const today = viewer.fmOrb.theDay.value;
    const yesterday = shitDate(today, -1);
    const tomorrow = shitDate(today, 1);
    return (<>
        <NoteTopSectionHeader
            viewer={viewer}
        />
        <div className="orbiz__item--flex-small" style={{ margin: "0.3rem 0" }}>
            create:
            <CreateMyNoteButton label="my" />
            <span style={{ margin: "0 0.3em" }}>{"|"}</span>
            <CreateLogNoteButton label="log" />
        </div >
        <div className="orbiz__item--flex-middle" style={{ margin: "0.5rem 0" }} >
            {AM.diary.getDailyTFile(yesterday) &&
                <span>
                    <DateDisplay date={yesterday} />
                    {"　<<"}
                </span>
            }
            {AM.diary.getDailyTFile(tomorrow) &&
                <span>
                    {">>　"}
                    <DateDisplay date={tomorrow} />
                </span>
            }
        </div>
        <hr />
        <div style={{ margin: "0.4rem 0" }} >
            {viewer.getDailyLogNoteList()}
        </div>
    </>)
}