import { Fragment } from "react/jsx-runtime";
import { MyNoteViewer } from "src/core/orb-system/services/viewers/MyNoteViewer";
import { NoteFmKey } from "src/orbits/contracts/fmKey";
import { FoldingElement } from "../common/FoldingElement";
import { DisplayRole } from "../fm-view/DisplayRole";
import { DisplayStdLinkedNotes } from "../fm-view/DisplayStdLinkedNotes";

export function MyNoteTopSection({ viewer }: { viewer: MyNoteViewer }) {
    const fmOrb = viewer.fmOrb;

    const keyList: NoteFmKey<"my">[] = [
        "tags",
        "categories",
    ]
    return (<>
        {keyList.map(key => (
            <Fragment key={`${viewer.note.id}-${key}`}>
                {fmOrb[key].getLooks()}
            </Fragment>
        ))}

        <h5>linked notes</h5>
        <DisplayStdLinkedNotes
            viewer={viewer}
        />
        <FoldingElement header="linked note tree" hLevel={5}>
            <DisplayStdLinkedNotes
                viewer={viewer}
                options={{ isTree: true }}
            />
        </FoldingElement>

        <DisplayRole
            viewer={viewer}
        />
    </>);
}