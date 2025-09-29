import { useState } from "react";
import { OSM } from "src/orbiz/managers/OrbizSettingManager";
import { EditableItemList } from "../common/EditableItemList";
import { MainNav } from "../menu/navigate/MainNav";

export function RoleKindsSetting({
    closeModal
}: {
    closeModal: () => void;
}) {

    const [roleKinds, setRoleKinds] = useState<string[]>(OSM().roleKinds);
    const handleClick = () => {
        OSM().setRoleKinds(roleKinds);
        OSM().save();
        alert("更新が完了しました。");
    }
    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <h1>Setting: RoleKinds</h1>

        <button onClick={handleClick}>更新</button>
        <EditableItemList
            labels={roleKinds}
            onChange={setRoleKinds}
        />
    </>)
}