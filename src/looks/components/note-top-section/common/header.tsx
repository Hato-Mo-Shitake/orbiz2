import { NoteViewer } from "src/orbits/contracts/note-orb";
import { OpenFmDisplayButton } from "../../common-orbiz/OpenFmDisplayButton";
import { OpenFmEditButton } from "../../common-orbiz/OpenFmEditButton";
import { OpenMainMenuButton } from "../../common-orbiz/OpenMainMenuButton";

export function NoteTopSectionHeader({ viewer }: { viewer: NoteViewer }) {
    return (<>
        <div className="orbiz__item--flex-small" style={{ margin: "0.3rem 0rem" }} >
            <OpenMainMenuButton />
            <OpenFmDisplayButton
                viewer={viewer}
            />
            <OpenFmEditButton
                viewer={viewer}
            />
        </div>
    </>)
}