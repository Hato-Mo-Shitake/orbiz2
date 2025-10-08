import { MyNote } from "src/core/domain/MyNote";
import { MyNoteReader } from "src/core/orb-system/services/readers/MyNoteReader";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { FoldingElement } from "../../common/FoldingElement";
import { NoteLinkList } from "../../common/NoteLinkList";

export function RoleNodesDisplay({
    store,
    rootNote,
    header = "",
}: {
    store: StoreApi<MyNoteState>,
    rootNote: MyNote,
    header?: string
}) {
    const inLinkIds = useStore(store, (s) => s.inLinkIds);
    if (!inLinkIds.length) return null;

    const roleNodes = MyNoteReader.getRoleNodeNoteList(rootNote, inLinkIds);
    if (!roleNodes.length) return null;
    return (<>
        <FoldingElement
            header={header}
            hLevel={4}
            defaultOpen={true}
        >
            <NoteLinkList
                notes={roleNodes}
            />
        </FoldingElement>
    </>)
}