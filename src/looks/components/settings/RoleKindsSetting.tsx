import { useState } from "react";
import { EditableItemList } from "../common/EditableItemList";
import { MainNav } from "../menu/navigate/MainNav";

export function RoleKindsSetting({
    closeModal
}: {
    closeModal: () => void;
}) {

    const [roleKinds, setRoleKinds] = useState<string[]>(AM.orbizSetting.roleKinds);
    const handleClick = () => {
        AM.orbizSetting.setRoleKinds(roleKinds);
        AM.orbizSetting.save();
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