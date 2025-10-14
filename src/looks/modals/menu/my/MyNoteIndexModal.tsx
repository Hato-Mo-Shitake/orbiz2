// import { Modal } from "obsidian";
// import { createRoot, Root } from "react-dom/client";
// import { MyNoteIndex } from "src/looks/components/menu/my/MyNoteIndex";
// import { MainNav } from "src/looks/components/menu/navigate/MainNav";
// import { OAM } from "src/orbiz/managers/OrbizAppManager";

// export class MyNoteIndexModal extends Modal {
//     static open() {
//         const modal = new MyNoteIndexModal(OAM().app);
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
//                 <h1>MyNote Index</h1>
//                 <MyNoteIndex
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