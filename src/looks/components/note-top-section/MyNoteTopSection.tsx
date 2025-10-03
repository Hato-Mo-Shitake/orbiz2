import { MyNoteViewer } from "src/core/orb-system/services/viewers/MyNoteViewer";

export function MyNoteTopSection({ viewer }: { viewer: MyNoteViewer }) {
    // const fmOrb = viewer.fmOrb;

    // const keyList: NoteFmKey<"my">[] = [
    //     "tags",
    //     "categories",
    // ]
    // return (<>
    //     {keyList.map(key => (
    //         <Fragment key={`${viewer.note.id}-${key}`}>
    //             {fmOrb[key].getLooks()}
    //         </Fragment>
    //     ))}

    //     <h5>linked notes</h5>
    //     <DisplayStdLinkedNotes
    //         viewer={viewer}
    //     />
    //     <FoldingElement header="linked note tree" hLevel={5}>
    //         <DisplayStdLinkedNotes
    //             viewer={viewer}
    //             options={{ isTree: true }}
    //         />
    //     </FoldingElement>

    //     <DisplayRole
    //         viewer={viewer}
    //     />
    // </>);
}