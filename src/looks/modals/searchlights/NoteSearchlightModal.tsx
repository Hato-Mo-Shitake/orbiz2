// import { Modal } from "obsidian";
// import { createRoot, Root } from "react-dom/client";
// import { NoteSearchlight } from "src/looks/components/searchlights/NoteSearchlight";
// import { OAM } from "src/orbiz/managers/OrbizAppManager";

// export class NoteSearchlightModal extends Modal {
//     static open() {
//         const modal = new NoteSearchlightModal(OAM().app);
//         modal.open();
//     }

//     root: Root | null = null;

//     onOpen() {
//         const { contentEl } = this;

//         this.root = createRoot(contentEl);
//         this.root!.render(
//             <NoteSearchlight
//                 closeModal={() => this.close()}
//             />
//         );
//     }

//     onClose() {
//         const { contentEl } = this;
//         contentEl.empty();
//     }
// }