// import { ItemView, WorkspaceLeaf } from "obsidian";
// import { createRoot, Root } from "react-dom/client";
// import { NoteSearchlight } from "src/looks/components/searchlights/NoteSearchlight";

// export const VIEW_TYPE_NOTE_SEARCHLIGHT = 'note-searchlight-view';
// export class NoteSearchlightView extends ItemView {
//     constructor(leaf: WorkspaceLeaf) {
//         super(leaf);
//     }

//     root: Root | null = null;

//     getViewType() {
//         return VIEW_TYPE_NOTE_SEARCHLIGHT;
//     }

//     getDisplayText() {
//         return 'Note Searchlight';
//     }

//     protected async onOpen() {

//         const container = this.contentEl;
//         container.empty();
//         const el = container.createEl("div");
//         this.root = createRoot(el);
//         this.root.render(
//             <NoteSearchlight />
//         )
//     }

//     protected async onClose(): Promise<void> {
//         this.root?.unmount();
//     }
// }