import { App, Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { NoteOrb } from "src/orbits/contracts/note-orb";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class FmDisplayModal extends Modal {
    static openNew(noteOrb: NoteOrb) {
        const { app } = OAM();
        new FmDisplayModal(app, noteOrb).open();
    }

    root: Root | null = null;
    private readonly _noteOrb: NoteOrb;

    constructor(app: App, noteOrb: NoteOrb) {
        super(app);
        this._noteOrb = noteOrb;
    }

    onOpen(): void {
        const { contentEl } = this;

        this.root = createRoot(contentEl);
        this.root!.render(
            // <StrictMode>
            <>
                {this._noteOrb.viewer.getFmLooks()}
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