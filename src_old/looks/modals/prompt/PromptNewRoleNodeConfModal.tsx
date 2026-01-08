import { Modal } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { AM } from "src/app/AppManager";
import { MyNote } from "src/core/domain/MyNote";
import { NewRoleNodeConfBox } from "src/looks/components/note-create/main/NewRoleNodeConfBox";
import { NewMyNoteConf } from "src/orbits/contracts/create-note";

export class PromptNewRoleNodeConfModal extends Modal {
    static get(
        roleHub: MyNote,
    ): Promise<NewMyNoteConf | null> {
        return new Promise<NewMyNoteConf | null>((resolve) => {
            const modal = new PromptNewRoleNodeConfModal(resolve, roleHub);
            modal.open();
        });
    }

    root: Root | null = null;
    constructor(
        private resolve: (conf: NewMyNoteConf | null) => void,
        private readonly roleHub: MyNote,
    ) {
        // super(OAM().app);
        super(AM.obsidian.app);
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
                <NewRoleNodeConfBox
                    resolve={resolve}
                    roleHub={this.roleHub}
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