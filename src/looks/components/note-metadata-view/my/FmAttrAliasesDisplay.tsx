import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrAliasesDisplay({
    store,
    header = "aliases"
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
}) {
    const aliases = useStore(store, (s) => s.fmAttrAliases);

    if (!aliases?.length) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {String(aliases)}
        </div>
    </>)
}