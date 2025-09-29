// import { MarkdownView, TFile } from "obsidian";
// import { createRoot, Root } from "react-dom/client";
// import { StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";

// export abstract class StdNoteView<TOrb extends StdNoteOrb = StdNoteOrb> extends MarkdownView {
//     root: Root | null = null;

//     abstract get noteOrb(): TOrb | null
//     abstract getViewType(): string


//     onload(): void {
//         super.onload();
//     }

//     reload() {
//         this.root!.render(
//             // <StrictMode>
//             <>
//                 {this.noteOrb?.viewer.getTopSection()}
//             </>

//             // </StrictMode>
//         )
//     }

//     async onOpen(): Promise<void> {
//         await super.onOpen();

//         const metadataContainer = this.containerEl.querySelector(".metadata-container")!;
//         const tmpEl = document.createElement("div");
//         metadataContainer.insertAdjacentElement("afterend", tmpEl);

//         this.root = createRoot(tmpEl);
//     }

//     async onLoadFile(file: TFile): Promise<void> {
//         await super.onLoadFile(file);

//         // TODO: navigate backが使えない。ので、どうしよう。-> MyNoteView同士の移動とかなら大丈夫だわ。
//         // await setTimeout(() => {
//         this.root!.render(
//             // <StrictMode>
//             <>
//                 {this.noteOrb?.viewer.getTopSection()}
//             </>

//             // </StrictMode>
//         );
//         // })
//     }

//     async onUnloadFile(file: TFile): Promise<void> {
//         await super.onUnloadFile(file);
//     }

//     onunload(): void {
//         super.onunload();
//     }

//     protected async onClose(): Promise<void> {
//         await super.onClose();
//         this.root?.unmount();
//     }
// }