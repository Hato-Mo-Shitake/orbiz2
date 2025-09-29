// import { ItemView, WorkspaceLeaf } from "obsidian";
// import { createRoot, Root } from "react-dom/client";
// import { MainMenu } from "src/looks/components/menu/MainMenu";
// import { VIEW_TYPE_MAIN_MENU } from "src/orbits/contracts/view";


// export class MainMenuView extends ItemView {
//     constructor(leaf: WorkspaceLeaf) {
//         super(leaf);
//     }

//     root: Root | null = null;

//     getViewType() {
//         return VIEW_TYPE_MAIN_MENU;
//     }

//     getDisplayText() {
//         return 'Main Menu';
//     }

//     protected async onOpen() {

//         const container = this.contentEl;
//         container.empty();
//         const el = container.createEl("div");
//         this.root = createRoot(el);
//         this.root.render(
//             <MainMenu />
//         )
//     }

//     protected async onClose(): Promise<void> {
//         this.root?.unmount();
//     }
// }