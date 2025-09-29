import { App, FuzzySuggestModal } from "obsidian";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class FSuggestModal extends FuzzySuggestModal<string> {
    static async getSelectedItem(options: string[]): Promise<string> {
        const app = OAM().app;
        return new Promise<string>((resolve) => {
            new FSuggestModal(app, options, resolve).open();
        });
    }

    constructor(
        app: App,
        private options: string[],
        private resolve: (value: string) => void
    ) {
        super(app);
    }

    getItems(): string[] {
        return this.options;
    }

    getItemText(item: string): string {
        return item;
    }

    onChooseItem(item: string, evt: MouseEvent | KeyboardEvent): void {
        this.resolve(item);
    }

    onClose(): void {
    }
}