import { MainMenuModal } from "src/looks/modals/menu/MainMenuModal";

export function OpenMainMenuButton() {
    const handleOpenMainMenu = () => {
        MainMenuModal.open();
    }
    return <button
        style={{ backgroundColor: "skyblue" }}
        onClick={handleOpenMainMenu}
    >main menu
    </button>
}