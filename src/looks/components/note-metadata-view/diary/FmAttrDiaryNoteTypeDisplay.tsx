import { DiaryNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrDiaryNoteTypeDisplay({
    store,
    header = "",
    headerWidth,
}: {
    store: StoreApi<DiaryNoteState>
    header?: string,
    headerWidth?: number
}) {
    const subType = useStore(store, (s) => s.fmAttrDiaryNoteType);

    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <a>
                {subType}
            </a>
        </SimpleViewBox>
    </>)
}