import { App, Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { NoteViewer } from "src/orbits/contracts/note-orb";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class FmDisplayModal extends Modal {
    static openNew(viewer: NoteViewer) {
        const { app } = OAM();
        new FmDisplayModal(app, viewer).open();
    }

    root: Root | null = null;
    private readonly _viewer: NoteViewer;

    constructor(app: App, viewer: NoteViewer) {
        super(app);
        this._viewer = viewer;
    }

    onOpen(): void {
        const { contentEl } = this;

        this.root = createRoot(contentEl);
        this.root!.render(
            // <StrictMode>
            <>
                {this._viewer.getFmAttrs()}
            </>
            // </StrictMode>
        );
    }

    onClose(): void {
        this.root?.unmount();
        const { contentEl } = this;
        contentEl.empty();
    }
}