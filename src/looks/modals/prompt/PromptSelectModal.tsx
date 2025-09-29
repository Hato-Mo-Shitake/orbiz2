import { Modal } from "obsidian";
import { ReactNode } from "react";
import { createRoot, Root } from "react-dom/client";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class PromptSelectModal<T = string> extends Modal {
    static get<T = string>(title: string, list: { value: T, label: string }[]): Promise<T | null> {
        return new Promise<T | null>((resolve) => {
            const modal = new PromptSelectModal<T | null>(title, list, resolve);
            modal.open();
        });
    }

    root: Root | null = null;

    constructor(
        private readonly title: string,
        private readonly list: { value: T, label: string }[],
        private resolve: (selected: T | null) => void
    ) {
        super(OAM().app);
    }

    onOpen() {
        const { contentEl } = this;

        const resolve = (selected: T) => {
            this.resolve(selected);
            this.close();
        }

        this.root = createRoot(contentEl);
        this.root!.render(
            <PromptSelectBox
                title={this.title}
                list={this.list}
                resolve={resolve}
            />
        );
    }

    onClose() {
        this.resolve(null);
        const { contentEl } = this;
        contentEl.empty();
    }
}

function PromptSelectBox<T>({
    title,
    list,
    resolve,
}: {
    title: string,
    list: { value: T, label: string }[]
    resolve: (selected: T) => void,
}): ReactNode {
    return (<>
        <h1>{title}</h1>
        <ul>
            {list.map(item =>
                <li key={item.label}>
                    <button onClick={() => resolve(item.value)}> {item.label}</button>
                </li>
            )}
        </ul>
    </>);
}