import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrRoleKindDisplay({
    store,
    header = "roleKind"
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
}) {
    const roleKind = useStore(store, (s) => s.fmAttrRoleKind);

    if (!roleKind) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {roleKind}
        </div>
    </>)
}