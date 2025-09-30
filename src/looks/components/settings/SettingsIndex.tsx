import { CategoriesSettingModal } from "src/looks/modals/settings/CategoriesSettingModal";
import { RoleKindSettingModal } from "src/looks/modals/settings/RoleKindSettingModal";
import { MainNav } from "../menu/navigate/MainNav";

export function SettingsIndex({
    closeModal
}: {
    closeModal: () => void;
}) {
    const _handleOpenModal = (modal: { open: () => void }): () => void => {
        return () => {
            closeModal();
            modal.open();
        }
    }

    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <h1>Settings Index</h1>
        <div>
            <ul style={{ fontSize: "20px" }}>
                <li><a onClick={_handleOpenModal(CategoriesSettingModal)}>categories</a></li>
                <li><a onClick={_handleOpenModal(RoleKindSettingModal)}>role kinds</a></li>
                <li><a>space type</a></li>
            </ul>
        </div>
    </>)
}