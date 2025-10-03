import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";

export function FmAttrCategoriesDisplay({
    store,
    header = "categories"
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
}) {
    const categories = useStore(store, (s) => s.fmAttrCategories);

    if (!categories?.length) return null;
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {String(categories)}
        </div>
    </>)
}