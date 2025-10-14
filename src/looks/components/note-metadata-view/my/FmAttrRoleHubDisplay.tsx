import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { NoteLink } from "../../common/NoteLink";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrRoleHubDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const roleHub = useStore(store, (s) => s.fmAttrRoleHub);

    if (!roleHub) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <NoteLink
                linkText={roleHub.path}
            />
        </SimpleViewBox>
    </>)
}