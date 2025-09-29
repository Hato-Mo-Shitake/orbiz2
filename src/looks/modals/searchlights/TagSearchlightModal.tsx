import { Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { TagSearchlight } from "src/looks/components/searchlights/TagSearchlight";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class TagSearchlightModal extends Modal {
    static open() {
        const modal = new TagSearchlightModal(OAM().app);
        modal.open();
    }

    root: Root | null = null;

    onOpen() {
        const { contentEl } = this;

        this.root = createRoot(contentEl);
        this.root!.render(
            <TagSearchlight
                closeModal={() => this.close()}
            />
        );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}