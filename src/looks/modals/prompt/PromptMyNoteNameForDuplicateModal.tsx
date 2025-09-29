import { Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { StdNote } from "src/core/domain/StdNote";
import { NewMyNoteNameInputForDuplicate } from "src/looks/components/note-create/main/NewMyNoteNameInputForDuplicate";
import { NewMyNoteConf } from "src/orbits/contracts/create-note";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export type IndividualNames = {
    newNoteName: string,
    alreadyNoteName: string,
}
export class PromptMyNoteNameForDuplicateModal extends Modal {
    static get(newNoteConf: NewMyNoteConf, alreadyNote: StdNote): Promise<IndividualNames | null> {
        return new Promise<IndividualNames | null>((resolve) => {
            const modal = new PromptMyNoteNameForDuplicateModal(resolve, newNoteConf, alreadyNote);
            modal.open();
        });
    }

    root: Root | null = null;

    constructor(
        private resolve: (newName: IndividualNames | null) => void,
        private readonly newNoteConf: NewMyNoteConf,
        private readonly alreadyNote: StdNote
    ) {
        super(OAM().app);
    }

    onOpen() {
        const { contentEl } = this;

        const resolve = (names: IndividualNames) => {
            this.resolve(names);
            this.close();
        }

        this.root = createRoot(contentEl);
        this.root!.render(
            // <StrictMode>
            <>
                <NewMyNoteNameInputForDuplicate
                    resolve={resolve}
                    newNoteConf={this.newNoteConf}
                    alreadyNote={this.alreadyNote}
                />
            </>
            // </StrictMode>
        );
    }

    onClose() {
        this.resolve(null);
        const { contentEl } = this;
        contentEl.empty();
    }
}