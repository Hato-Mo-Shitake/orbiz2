import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { NoteLink } from "../../common/NoteLink";

export function FmAttrRoleHubDisplay({
    store,
    header
}: {
    store: StoreApi<MyNoteState>,
    header?: string;
}) {
    const roleHub = useStore(store, (s) => s.fmAttrRoleHub);

    if (!roleHub) return null;
    return (<>
        <div>
            {header && <span>{header || "roleHub"}: </span>}
            <NoteLink
                linkText={roleHub.path}
            />
        </div>
    </>)
}