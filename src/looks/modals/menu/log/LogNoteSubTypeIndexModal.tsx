import { App, Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { LogNoteSubTypeIndex } from "src/looks/components/menu/log/LogNoteSubTypeIndex";
import { LogNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class LogNoteSubTypeIndexModal extends Modal {
    static open(subType: LogNoteType) {
        const modal = new LogNoteSubTypeIndexModal(OAM().app, subType);
        modal.open();
    }

    root: Root | null = null;
    constructor(
        app: App,
        private readonly subType: LogNoteType,
    ) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;

        this.root = createRoot(contentEl);
        this.root!.render(
            <LogNoteSubTypeIndex
                subType={this.subType}
                closeModal={() => this.close()}
            />
        );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}