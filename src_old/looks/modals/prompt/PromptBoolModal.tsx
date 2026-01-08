import { Modal } from "obsidian";
import { ReactNode } from "react";
import { createRoot, Root } from "react-dom/client";
import { AM } from "src/app/AppManager";

export class PromptBoolModal extends Modal {
    static get(msg: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const modal = new PromptBoolModal(msg, resolve);
            modal.open();
        });
    }

    root: Root | null = null;

    constructor(
        private readonly msg: string,
        private resolve: (flag: boolean) => void
    ) {
        // super(OAM().app);
        super(AM.obsidian.app);
    }

    onOpen() {
        const { contentEl } = this;

        const resolve = (value: boolean) => {
            this.resolve(value);
            this.close();
        }

        this.root = createRoot(contentEl);
        this.root!.render(
            // <StrictMode>
            <PromptBooleanBox
                msg={this.msg}
                resolve={resolve}
            // resolve={this.resolve}
            // close={this.close.bind(this)}
            />
            // </StrictMode>
        );
    }

    onClose() {
        this.resolve(false);
        const { contentEl } = this;
        contentEl.empty();
    }
}

function PromptBooleanBox({
    msg,
    resolve,
    // close
}: {
    msg: string,
    resolve: (flag: boolean) => void,
}): ReactNode {
    return (<>
        <h1>{msg}</h1>
        <button onClick={() => resolve(true)}>OK</button>
        <button onClick={() => resolve(false)}>NO</button>
    </>);
}