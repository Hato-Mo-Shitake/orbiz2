import { openModalMainMenu } from "src/looks/modals/SimpleDisplayModal";

export function OpenMainMenuButton() {
    return (<>
        <button
            onClick={openModalMainMenu}
        >
            main menu
        </button>
    </>)
}