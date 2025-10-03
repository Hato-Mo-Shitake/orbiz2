import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrTemplateDoneDisplay({
    store,
    header = "templateDone"
}: {
    store: StoreApi<DailyNoteState>,
    header?: string,
}) {
    const templateDone = useStore(store, (s) => s.fmAttrTemplateDone);

    if (!templateDone?.length) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {String(templateDone)}
        </div>
    </>)
}