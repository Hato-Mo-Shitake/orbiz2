import { Modal } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { AM } from "src/app/AppManager";
import { StdNote } from "src/core/domain/StdNote";
import { NewMyNoteConf } from "src/orbits/contracts/create-note";
import { NewMyNoteConfBox } from "../../components/note-create/main/NewMyNoteConfBox";

export class PromptNewMyNoteConfModal extends Modal {
    static get(options?: {
        baseName?: string,
        rootNote?: StdNote,
    }): Promise<NewMyNoteConf | null> {
        return new Promise<NewMyNoteConf | null>((resolve) => {
            const modal = new PromptNewMyNoteConfModal(resolve, options);
            modal.open();
        });
    }

    root: Root | null = null;

    private readonly _baseName: string | null;
    private readonly _rootNote: StdNote | null;
    private readonly _defaultNoteName: string | null;
    constructor(
        private resolve: (conf: NewMyNoteConf | null) => void,
        options?: {
            baseName?: string,
            rootNote?: StdNote,
        }
    ) {
        // super(OAM().app);
        super(AM.obsidian.app);
        this._baseName = options?.baseName || null;
        this._rootNote = options?.rootNote || null;
    }

    onOpen() {
        const { contentEl } = this;

        const resolve = (conf: NewMyNoteConf | null) => {
            this.resolve(conf);
            this.close();
        }

        this.root = createRoot(contentEl);
        this.root!.render(
            <StrictMode>
                <NewMyNoteConfBox
                    resolve={resolve}
                    options={{
                        baseName: this._baseName || undefined,
                        rootNote: this._rootNote || AM.note.activeStdNote || undefined,
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