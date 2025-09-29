import { Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { LogNoteIndex } from "src/looks/components/menu/log/LogNoteIndex";
import { MainNav } from "src/looks/components/menu/navigate/MainNav";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class LogNoteIndexModal extends Modal {
    static open() {
        const modal = new LogNoteIndexModal(OAM().app);
        modal.open();
    }

    root: Root | null = null;

    onOpen() {
        const { contentEl } = this;

        const closeModal = () => {
            this.close();
        }

        this.root = createRoot(contentEl);
        this.root!.render(
            <>
                <MainNav
                    closeModal={closeModal}
                />
                <h1>LogNote Index</h1>
                <LogNoteIndex
                    closeModal={closeModal}
                />
            </>
        );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}