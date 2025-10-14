// import { Modal } from "obsidian";
// import { createRoot, Root } from "react-dom/client";
// import { SettingsIndex } from "src/looks/components/settings/SettingsIndex";
// import { OAM } from "src/orbiz/managers/OrbizAppManager";

// export class SettingsIndexModal extends Modal {
//     static open() {
//         const modal = new SettingsIndexModal(OAM().app);
//         modal.open();
//     }

//     root: Root | null = null;

//     onOpen() {
//         const { contentEl } = this;

//         this.root = createRoot(contentEl);
//         if (!this.root) return;
//         this.root.render(
//             <SettingsIndex
//                 closeModal={() => this.close()}
//             />
//         );
//     }

//     onClose() {
//         const { contentEl } = this;
//         contentEl.empty();
//     }
// }