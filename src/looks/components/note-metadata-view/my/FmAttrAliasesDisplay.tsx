import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { ItemList } from "../../common/ItemList";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrAliasesDisplay({
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
    const aliases = useStore(store, (s) => s.fmAttrAliases);

    if (!aliases?.length) return null;
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <ItemList
                // あとで、tagリンク的なの追加予定。
                list={aliases}
                keySlug="aliases"
                isHorizon={isHorizon}
            />
        </SimpleViewBox>
    </>)
}