import { Modal } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { StdNote } from "src/core/domain/StdNote";
import { NewLogNoteConf } from "src/orbits/contracts/create-note";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { NewLogNoteConfBox } from "../../components/note-create/main/NewLogNoteConfBox";

export class PromptNewLogNoteConfModal extends Modal {
    static get(options?: {
        baseName?: string,
        rootNote?: StdNote
    }): Promise<NewLogNoteConf | null> {
        return new Promise<NewLogNoteConf | null>((resolve) => {
            const modal = new PromptNewLogNoteConfModal(resolve, options);
            modal.open();
        });
    }

    root: Root | null = null;
    private readonly _baseName: string | null;
    private readonly _rootNote: StdNote | null;
    constructor(
        private resolve: (conf: NewLogNoteConf | null) => void,
        options?: {
            baseName?: string,
            rootNote?: StdNote
        }
    ) {
        super(OAM().app);
        this._baseName = options?.baseName || null;
        this._rootNote = options?.rootNote || null;
    }

    onOpen() {
        const { contentEl } = this;
        // const { modalEl } = this;

        const resolve = (conf: NewLogNoteConf | null) => {
            this.resolve(conf);
            this.close();
        }

        this.root = createRoot(contentEl);
        if (!this.root) return;
        this.root.render(
            <StrictMode>

                <NewLogNoteConfBox
                    resolve={resolve}
                    options={{
                        baseName: this._baseName || undefined,
                        rootNote: this._rootNote || ONM().activeStdNote || undefined
                    }}
                />
            </StrictMode>
        );
    }

    onClose() {
        this.resolve(null);
        const { contentEl } = this;
        contentEl.empty();
    }
}