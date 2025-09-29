// import { Root } from "react-dom/client";
// import { MyNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
// import { OOM } from "src/orbiz/managers/OrbizOrbManager";
// import { StdNoteView } from "./StdNoteView";

// export const VIEW_TYPE_MY_NOTE = "my-note-view";
// export class MyNoteView extends StdNoteView<MyNoteOrb> {
//     root: Root | null = null;

//     get noteOrb(): MyNoteOrb | null {
//         const tFile = this.file;
//         if (!tFile) return null;

//         return OOM().getMyNoteOrb(tFile);
//     }

//     getViewType(): string {
//         return VIEW_TYPE_MY_NOTE;
//     }
// }

