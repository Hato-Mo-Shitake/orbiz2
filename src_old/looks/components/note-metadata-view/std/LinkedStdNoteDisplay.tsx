import { Fragment } from "react/jsx-runtime";
import { isLogNote } from "src/core/domain/LogNote";
import { StdNote } from "src/core/domain/StdNote";
import { StdNoteReader } from "src/core/orb-system/services/readers/StdNoteReader";
import { LinkedNoteDirection } from "src/orbits/contracts/create-note";
import { FmKey } from "src/orbits/contracts/fmKey";
import { RecursiveTree } from "src/orbits/contracts/tree";
import { SubNoteType, subNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";
import { StdNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { FoldingElement } from "../../common/FoldingElement";
import { NoteLinkTree } from "../../common/NoteLinkTree";

export function LinkedStdNoteDisplay({
    store,
    rootNote,
    fmKey,
    direction,
    header = "",
}: {
    store: StoreApi<StdNoteState>,
    rootNote: StdNote,
    fmKey: FmKey<"stdLinkedNoteList">,
    direction: LinkedNoteDirection,
    header?: string
}) {
    let ids: string[] = [];

    if (direction == "out") {
        const outLinkIds = useStore(store, (s) => s.outLinkIds);
        ids = StdNoteReader.getOutLinkedNoteList(
            rootNote,
            fmKey,
            outLinkIds
        ).map(n => n.id);
    } else if (direction == "in") {
        const inLinkIds = useStore(store, (s) => s.inLinkIds);
        ids = StdNoteReader.getInLinkedNoteList(
            rootNote,
            fmKey,
            inLinkIds
        ).map(n => n.id);
    }

    if (!ids.length) return null;

    const noteTrees = ids.map(id => StdNoteReader.buildRecursiveStdNoteTree(
        id,
        fmKey,
        direction
    ))
    if (!noteTrees.length) return null;

    const subTypeTreeMap: Partial<Record<SubNoteType, RecursiveTree<StdNote>[]>> = {};

    noteTrees.forEach(noteTree => {
        const note = noteTree.hub;
        if (isLogNote(note) && note.isResolved) return;
        if (!subTypeTreeMap[note.subType]) subTypeTreeMap[note.subType] = [];

        subTypeTreeMap[note.subType]!.push(noteTree);
    });

    if (!Object.keys(subTypeTreeMap).length) return null;

    const stdNoteTrees = subNoteTypeList.map(subType => {
        if (!subTypeTreeMap[subType]?.length) return <Fragment key={subType}></Fragment>;
        return (<Fragment key={subType}>
            <div style={{ marginLeft: "1em" }}>
                {`[${subType}]`}
            </div>
            {subTypeTreeMap[subType].map(tree =>
                <Fragment key={`${subType}-${tree.hub.id}`}>
                    <NoteLinkTree noteTree={tree} />
                </Fragment>
            )}
        </Fragment>)
    });

    return (<>
        {header
            ? <FoldingElement header={header} hLevel={0} defaultOpen={true}>
                {stdNoteTrees}
            </FoldingElement>
            : { stdNoteTrees }
        }
    </>)
}