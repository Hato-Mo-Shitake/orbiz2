import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrRoleKindDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const roleKind = useStore(store, (s) => s.fmAttrRoleKind);

    if (!roleKind) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <a>
                {roleKind}
            </a>
        </SimpleViewBox>
    </>)
}