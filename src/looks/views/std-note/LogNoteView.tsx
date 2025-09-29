// import { Root } from "react-dom/client";
// import { LogNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
// import { OOM } from "src/orbiz/managers/OrbizOrbManager";
// import { StdNoteView } from "./StdNoteView";

// export const VIEW_TYPE_LOG_NOTE = "log-note-view";
// export class LogNoteView extends StdNoteView<LogNoteOrb> {
//     root: Root | null = null;

//     get noteOrb(): LogNoteOrb | null {
//         const tFile = this.file;
//         if (!tFile) return null;
//         return OOM().getLogNoteOrb(tFile);
//     }

//     getViewType(): string {
//         return VIEW_TYPE_LOG_NOTE;
//     }
// }

