import { App, Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { DailyNoteIndexByMonth } from "src/looks/components/menu/diary/DailyNoteIndexByMonth";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class DailyNoteIndexByMonthModal extends Modal {
    static open(
        y: number,
        m: number
    ) {
        const modal = new DailyNoteIndexByMonthModal(OAM().app, y, m);
        modal.open();
    }

    root: Root | null = null;
    constructor(
        app: App,
        private readonly y: number,
        private readonly m: number
    ) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;

        this.root = createRoot(contentEl);
        this.root!.render(
            <DailyNoteIndexByMonth
                y={this.y}
                m={this.m}
                closeModal={() => this.close()}
            />
        );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}