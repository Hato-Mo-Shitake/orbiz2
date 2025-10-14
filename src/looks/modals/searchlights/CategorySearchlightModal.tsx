// import { Modal } from "obsidian";
// import { createRoot, Root } from "react-dom/client";
// import { CategorySearchlight } from "src/looks/components/searchlights/CategorySearchlight";
// import { OAM } from "src/orbiz/managers/OrbizAppManager";

// export class CategorySearchlightModal extends Modal {
//     static open() {
//         const modal = new CategorySearchlightModal(OAM().app);
//         modal.open();
//     }

//     root: Root | null = null;

//     onOpen() {
//         const { contentEl } = this;

//         this.root = createRoot(contentEl);
//         this.root!.render(
//             <CategorySearchlight
//                 closeModal={() => this.close()}
//             />
//         );
//     }

//     onClose() {
//         const { contentEl } = this;
//         contentEl.empty();
//     }
// }