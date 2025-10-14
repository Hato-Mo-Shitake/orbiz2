// import { Modal } from "obsidian";
// import { createRoot, Root } from "react-dom/client";
// import { DiaryNoteIndex } from "src/looks/components/menu/diary/DiaryNoteIndex";
// import { MainNav } from "src/looks/components/menu/navigate/MainNav";
// import { OAM } from "src/orbiz/managers/OrbizAppManager";

// export class DiaryNoteIndexModal extends Modal {
//     static open() {
//         const modal = new DiaryNoteIndexModal(OAM().app);
//         modal.open();
//     }

//     root: Root | null = null;

//     onOpen() {
//         const { contentEl } = this;

//         const closeModal = () => {
//             this.close();
//         }

//         this.root = createRoot(contentEl);
//         this.root!.render(
//             <>
//                 <MainNav
//                     closeModal={closeModal}
//                 />
//                 <h1>DiaryNote Index</h1>
//                 <DiaryNoteIndex
//                     closeModal={closeModal}
//                 />
//             </>
//         );
//     }

//     onClose() {
//         const { contentEl } = this;
//         contentEl.empty();
//     }
// }