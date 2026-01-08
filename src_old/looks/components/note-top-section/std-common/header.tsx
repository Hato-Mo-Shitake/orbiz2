import { StdNoteViewer } from "src/core/orb-system/services/viewers/StdNoteViewer";
import { CreateLogNoteButton } from "../../common-orbiz/CreateLogNoteButton";
import { CreateMyNoteButton } from "../../common-orbiz/CreateMyNoteButton";
import { DateDisplay } from "../../common/DateDisplay";
import { NoteTopSectionHeader } from "../common/header";

export function StdNoteTopSectionHeader({ viewer }: { viewer: StdNoteViewer }) {
    return (<>
        <NoteTopSectionHeader
            viewer={viewer}
        />

        <div className="orbiz__item--flex-small" style={{ margin: "0.3rem 0" }}>
            create:
            <CreateMyNoteButton rootNote={viewer.note} label="my" />
            <span style={{ margin: "0 0.3em" }}>{"|"}</span>
            <CreateLogNoteButton rootNote={viewer.note} label="log" />
        </div >

        <div className="orbiz__item--flex-middle" style={{ margin: "0.5rem 0" }} >
            <span>
                c: <DateDisplay date={viewer.note.created} />
            </span>
            <span>
                m: <DateDisplay date={viewer.note.modified} />
            </span>
        </div>
    </>)
}