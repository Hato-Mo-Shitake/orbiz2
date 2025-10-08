import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrAspectDisplay({
    store,
    header,
    headerWidth
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
    headerWidth?: number
}) {
    const aspect = useStore(store, (s) => s.fmAttrAspect);

    if (!aspect) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <a>
                {aspect}
            </a>
        </SimpleViewBox>
    </>)
}