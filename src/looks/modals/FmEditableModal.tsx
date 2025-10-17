import { App, Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { AM } from "src/app/AppManager";
import { NoteViewer } from "src/orbits/contracts/note-orb";

export class FmEditableModal extends Modal {
    static openNew(viewer: NoteViewer) {
        // const { app } = OAM();
        const { app } = AM.obsidian;
        new FmEditableModal(app, viewer).open();
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
                {this._viewer.getFmAttrsEditor()}
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