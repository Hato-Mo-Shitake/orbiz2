import { shitDate } from "src/assistance/utils/date";
import { DailyNoteViewer } from "src/core/orb-system/services/viewers/DailyNoteViewer";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
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
            {ODM().getDailyTFile(yesterday) &&
                <span>
                    <DateDisplay date={yesterday} />
                    {"　<<"}
                </span>
            }
            {ODM().getDailyTFile(tomorrow) &&
                <span>
                    {">>　"}
                    <DateDisplay date={tomorrow} />
                </span>
            }
        </div>
    </>)
}