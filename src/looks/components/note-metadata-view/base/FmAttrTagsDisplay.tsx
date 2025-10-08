import { BaseNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { ItemList } from "../../common/ItemList";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrTagsDisplay({
    store,
    header,
    isHorizon = false,
    headerWidth,
}: {
    store: StoreApi<BaseNoteState>,
    header?: string,
    isHorizon?: boolean,
    headerWidth?: number
}) {
    const tags = useStore(store, (s) => s.fmAttrTags);

    if (!tags?.length) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <ItemList
                // あとで、tagリンク的なの追加予定。
                list={tags.map(tag => <a>{tag}</a>)}
                keySlug="tag"
                isHorizon={isHorizon}
            />
        </SimpleViewBox>
    </>)
}