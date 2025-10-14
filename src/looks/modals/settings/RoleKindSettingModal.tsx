// import { Modal } from "obsidian";
// import { createRoot, Root } from "react-dom/client";
// import { RoleKindsSetting } from "src/looks/components/settings/RoleKindsSetting";
// import { OAM } from "src/orbiz/managers/OrbizAppManager";

// export class RoleKindSettingModal extends Modal {
//     static open() {
//         const modal = new RoleKindSettingModal(OAM().app);
//         modal.open();
//     }

//     root: Root | null = null;

//     onOpen() {
//         const { contentEl } = this;

//         this.root = createRoot(contentEl);
//         if (!this.root) return;
//         this.root.render(
//             <RoleKindsSetting
//                 closeModal={() => this.close()}
//             />
//         );
//     }

//     onClose() {
//         const { contentEl } = this;
//         contentEl.empty();
//     }
// }