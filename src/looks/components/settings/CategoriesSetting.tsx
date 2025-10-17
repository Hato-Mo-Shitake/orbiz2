import { useState } from "react";
import { EditableItemList } from "../common/EditableItemList";
import { MainNav } from "../menu/navigate/MainNav";

export function CategoriesSetting({
    closeModal
}: {
    closeModal: () => void;
}) {

    const [categories, setCategories] = useState<string[]>(AM.orbizSetting.categories);
    const handleClick = () => {
        AM.orbizSetting.setCategories(categories);
        AM.orbizSetting.save();
        alert("更新が完了しました。");
    }
    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <h1>Setting: Categories</h1>

        <button onClick={handleClick}>更新</button>
        <EditableItemList
            labels={categories}
            onChange={setCategories}
        />
    </>)
}