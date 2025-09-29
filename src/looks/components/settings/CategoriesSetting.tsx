import { useState } from "react";
import { OSM } from "src/orbiz/managers/OrbizSettingManager";
import { EditableItemList } from "../common/EditableItemList";
import { MainNav } from "../menu/navigate/MainNav";

export function CategoriesSetting({
    closeModal
}: {
    closeModal: () => void;
}) {

    const [categories, setCategories] = useState<string[]>(OSM().categories);
    const handleClick = () => {
        OSM().setCategories(categories);
        OSM().save();
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