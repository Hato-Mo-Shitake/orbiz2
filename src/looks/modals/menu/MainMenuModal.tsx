import { Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { MainMenu } from "src/looks/components/menu/MainMenu";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class MainMenuModal extends Modal {
    static open() {
        const modal = new MainMenuModal(OAM().app);
        modal.open();
    }

    root: Root | null = null;

    onOpen() {
        const { contentEl } = this;

        this.root = createRoot(contentEl);
        this.root!.render(
            <MainMenu
                closeModal={() => this.close()}
            />
        );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}