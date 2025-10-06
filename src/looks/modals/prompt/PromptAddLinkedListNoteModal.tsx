import { Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { AddLinkedNoteListBox } from "src/looks/components/note-metadata-edit/main/AddLinkedNoteListBox";
import { OAM } from "src/orbiz/managers/OrbizAppManager";


export class PromptAddLinkedListNoteModal extends Modal {
    static get(addLinkedNoteIds: string[], noteOrb: StdNoteOrb): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const modal = new PromptAddLinkedListNoteModal(resolve, addLinkedNoteIds, noteOrb);
            modal.open();
        });
    }

    root: Root | null = null;

    constructor(
        private resolve: (newName: boolean) => void,
        private readonly addLinkedNoteIds: string[],
        private readonly noteOrb: StdNoteOrb
    ) {
        super(OAM().app);
    }

    onOpen() {
        const { contentEl } = this;

        const resolve = (isAdd: boolean) => {
            this.resolve(isAdd);
            this.close();
        }

        this.root = createRoot(contentEl);
        this.root!.render(
            // <StrictMode>
            <>
                <AddLinkedNoteListBox
                    linkedNoteIds={this.addLinkedNoteIds}
                    rootNoteOrb={this.noteOrb}
                    options={{
                        resolve: resolve
                    }}
                />
            </>
            // </StrictMode>
        );
    }

    onClose() {
        this.resolve(false);
        const { contentEl } = this;
        contentEl.empty();
    }
}