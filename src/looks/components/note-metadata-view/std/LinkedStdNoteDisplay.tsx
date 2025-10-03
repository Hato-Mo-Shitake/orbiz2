import { StdNote } from "src/core/domain/StdNote";
import { StdNoteReader } from "src/core/orb-system/services/readers/StdNoteReader";
import { LinkedNoteDirection } from "src/orbits/contracts/create-note";
import { FmKey } from "src/orbits/contracts/fmKey";
import { StdNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { NoteLinkTreeList } from "../../common/NoteLinkTreeList";

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
    return (<>
        {header && <div>{header}: </div>}
        <NoteLinkTreeList
            noteTrees={noteTrees}
        />
    </>)
}