import { Editor, MarkdownFileInfo, MarkdownView, TFile, WorkspaceLeaf } from "obsidian";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { OEwM } from "src/orbiz/managers/OrbizEventWatchManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { OVM } from "src/orbiz/managers/OrbizViewManager";

type EventHandlerForWorkspaceMap = {
    layoutChange: () => any,
    activeLeafChange: (leaf: WorkspaceLeaf | null) => any,
    fileOpen: (tFile: TFile | null) => any,
    editorChange: (editor: Editor, info: MarkdownView | MarkdownFileInfo) => any,
}
export type EventHandlerForWorkspace<K extends keyof EventHandlerForWorkspaceMap> = EventHandlerForWorkspaceMap[K];

/*-------------------------------*/

const handleUpdateNoteOrbCaches: EventHandlerForWorkspace<"layoutChange"> = async () => {
    OCM().updateNoteOrbCaches();
}
const handleSetNoteTopSection: EventHandlerForWorkspace<"fileOpen"> = (tFile) => {
    if (!tFile) return;

    const leaves = OAM().app.workspace.getLeavesOfType("markdown");
    leaves.forEach(leaf => {
        if (!(leaf.view instanceof MarkdownView)) return;

        const mdView = leaf.view;
        if (tFile.path !== mdView.file?.path) return;

        OVM().mountOrUpdateNoteTopSection(mdView);
    });
}
const handleWatchUserEdit: EventHandlerForWorkspace<"editorChange"> = (editor, info) => {
    if (info instanceof MarkdownView) {
        const tFile = info?.file || null;
        if (!tFile) return;
        const noteId = ONM().getNoteIdByTFile(tFile);
        if (!noteId) return;
        OEwM().userEditWatcher.userEdit(noteId, editor, info);
    }
}

/*-------------------------------*/

const handleListActiveLeafChange: EventHandlerForWorkspace<"activeLeafChange">[] = [

];
const handleListLayoutChange: EventHandlerForWorkspace<"layoutChange">[] = [
    handleUpdateNoteOrbCaches
];
const handleListFileOpen: EventHandlerForWorkspace<"fileOpen">[] = [
    handleSetNoteTopSection
];
const handleListEditorChange: EventHandlerForWorkspace<"editorChange">[] = [
    handleWatchUserEdit
];

/*-------------------------------*/

export const EventHandlersForWorkspace = {
    "activeLeafChange": handleListActiveLeafChange,
    "layoutChange": handleListLayoutChange,
    "fileOpen": handleListFileOpen,
    "editorChange": handleListEditorChange,
}