import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { ItemList } from "../../common/ItemList";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrCategoriesDisplay({
    store,
    header,
    isHorizon = false,
    headerWidth,
}: {
    store: StoreApi<MyNoteState>,
    header?: string,
    isHorizon?: boolean,
    headerWidth?: number
}) {
    const categories = useStore(store, (s) => s.fmAttrCategories);

    if (!categories?.length) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <ItemList
                // あとで、tagリンク的なの追加予定。
                list={categories.map(c => <a>{c}</a>)}
                keySlug="categories"
                isHorizon={isHorizon}
            />
        </SimpleViewBox>
    </>)
}