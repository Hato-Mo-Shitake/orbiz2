// import { MarkdownView } from "obsidian";
// import { createRoot, Root } from "react-dom/client";
// import { NoteTopSection } from "src/looks/components/note-top-section/NoteTopSection";
// import { OEM } from "./OrbizErrorManager";

// interface RootEntry {
//     root: Root;
//     observer: MutationObserver;
// }
// export class OrbizReactManager {
//     private static _instance: OrbizReactManager | null = null;

//     static setInstance(
//     ): void {
//         this._instance = new OrbizReactManager(
//         );
//     }

//     static getInstance(): OrbizReactManager {
//         if (!this._instance) OEM.throwNotInitializedError(OrbizReactManager);

//         return this._instance;
//     }

//     /** ------------ */

//     readonly containerRootMap: Map<HTMLElement, RootEntry> = new Map();
//     private constructor(
//     ) {
//     }

//     mountOrUpdateNoteTopSection(mdView: MarkdownView) {
//         const metadataContainer = mdView.containerEl.querySelector(".metadata-container");
//         if (!(metadataContainer instanceof HTMLElement)) return;
//         const tFile = mdView.file;
//         if (!tFile) return;

//         const entry = this.containerRootMap.get(metadataContainer);

//         if (entry) {
//             // 既存 root を再利用して再レンダリング
//             // debugConsole("再レンダリング", this.containerRootMap);
//             // new Notice("再レンダリング");
//             entry.root.render(<NoteTopSection tFile={tFile} />);
//             return;
//         }

//         // 新規 root 作成
//         const topSectionContainer = document.createElement("div");
//         metadataContainer.appendChild(topSectionContainer);
//         const root = createRoot(topSectionContainer);
//         root.render(<NoteTopSection tFile={tFile} />);

//         // metadata-container 削除監視
//         // NOTE: thisとアロー関数の関係に注意。functionは使わない。
//         const observer = new MutationObserver(() => {
//             const entry = this.containerRootMap.get(metadataContainer);
//             if (!entry) return; // 削除済み？

//             if (!document.body.contains(metadataContainer)) {
//                 // debugConsole("unmountされます。", this.containerRootMap);
//                 entry.root.unmount();
//                 entry.observer.disconnect();
//                 this.containerRootMap.delete(metadataContainer);
//                 // new Notice("unmountされました。");
//                 // debugConsole("unmountされました。", this.containerRootMap);
//             }
//         });
//         observer.observe(mdView.containerEl, { childList: true, subtree: true });

//         this.containerRootMap.set(metadataContainer, { root, observer });
//         // new Notice("新規rootが作成されました。");
//         // debugConsole("新規rootが作成されました。", this.containerRootMap);
//     }
// }

// export const OReactM = () => {
//     return OrbizReactManager.getInstance();
// }