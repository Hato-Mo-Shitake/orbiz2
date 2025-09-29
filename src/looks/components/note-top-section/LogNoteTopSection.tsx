import { Fragment } from "react/jsx-runtime";
import { LogNoteViewer } from "src/core/orb-system/services/viewers/LogNoteViewer";
import { NoteFmKey } from "src/orbits/contracts/fmKey";
import { FoldingElement } from "../common/FoldingElement";
import { DisplayStdLinkedNotes } from "../fm-view/DisplayStdLinkedNotes";

export function LogNoteTopSection({ viewer }: { viewer: LogNoteViewer }) {
    const fmOrb = viewer.fmOrb;

    const keyList: NoteFmKey<"log">[] = [
        "tags",
        "status",
        "due",
        "resolved",
        "context"
    ];

    // TODO: ループに使うkeyはその画面固有のものにするべき。
    // 遷移先と同じkeyを使うと、上手く再描画されない。
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
    </>);
}