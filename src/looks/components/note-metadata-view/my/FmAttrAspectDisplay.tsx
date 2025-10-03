import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrAspectDisplay({
    store,
    header = "aspect"
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
}) {
    const aspect = useStore(store, (s) => s.fmAttrAspect);

    if (!aspect) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {aspect}
        </div>
    </>)
}