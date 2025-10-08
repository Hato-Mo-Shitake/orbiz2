import { StdNoteViewer } from "src/core/orb-system/services/viewers/StdNoteViewer";
import { OpenFmDisplayButton } from "../../common-orbiz/OpenFmDisplayButton";
import { OpenFmEditButton } from "../../common-orbiz/OpenFmEditButton";
import { OpenMainMenuButton } from "../../common-orbiz/OpenMainMenuButton";
import { DateDisplay } from "../../common/DateDisplay";

export function StdNoteTopSectionHeader({ viewer }: { viewer: StdNoteViewer }) {
    return (<>
        <div
            style={{ margin: "0.8em", display: "flex", gap: "1em" }}
        >
            <OpenMainMenuButton />
            <OpenFmDisplayButton
                viewer={viewer}
            />
            <OpenFmEditButton
                viewer={viewer}
            />
        </div>
        <div
            style={{ marginTop: "0.9em", display: "flex", gap: "0.3em" }}
        >
            <span>
                c:
                <DateDisplay date={viewer.note.created} />
            </span>
            <span>{"|"}</span>
            <span>
                m:
                <DateDisplay date={viewer.note.modified} />
            </span>
        </div>
    </>)
}