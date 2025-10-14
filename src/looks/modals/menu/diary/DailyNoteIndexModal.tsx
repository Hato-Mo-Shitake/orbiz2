// import { App, Modal } from "obsidian";
// import { createRoot, Root } from "react-dom/client";
// import { DailyNoteIndex } from "src/looks/components/menu/diary/DailyNoteIndex";
// import { OAM } from "src/orbiz/managers/OrbizAppManager";

// export class DailyNoteIndexModal extends Modal {
//     static open() {
//         const modal = new DailyNoteIndexModal(OAM().app);
//         modal.open();
//     }

//     root: Root | null = null;
//     constructor(
//         app: App,
//     ) {
//         super(app);
//     }

//     onOpen() {
//         const { contentEl } = this;

//         this.root = createRoot(contentEl);
//         this.root!.render(
//             <DailyNoteIndex
//                 closeModal={() => this.close()}
//             />
//         );
//     }

//     onClose() {
//         const { contentEl } = this;
//         contentEl.empty();
//     }
// }