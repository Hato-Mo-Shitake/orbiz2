import { App, Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { MyNoteSubTypeIndex } from "src/looks/components/menu/my/MyNoteSubTypeIndex";
import { MyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class MyNoteSubTypeIndexModal extends Modal {
    static open(subType: MyNoteType) {
        const modal = new MyNoteSubTypeIndexModal(OAM().app, subType);
        modal.open();
    }

    root: Root | null = null;
    constructor(
        app: App,
        private readonly subType: MyNoteType,
    ) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;

        this.root = createRoot(contentEl);
        this.root!.render(
            <MyNoteSubTypeIndex
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