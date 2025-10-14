import { generateChangeModal, openModalCategoriesSetting, openModalRoleKindsSetting } from "src/looks/modals/SimpleDisplayModal";
import { MainNav } from "../menu/navigate/MainNav";

export function SettingsIndex({
    closeModal
}: {
    closeModal?: () => void;
}) {
    const changeModal = generateChangeModal(closeModal);

    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <h1>Settings Index</h1>
        <div>
            <ul style={{ fontSize: "20px" }}>
                <li><a onClick={() => changeModal(openModalCategoriesSetting)}>categories</a></li>
                <li><a onClick={() => changeModal(openModalRoleKindsSetting)}>role kinds</a></li>
            </ul>
        </div>
    </>)
}