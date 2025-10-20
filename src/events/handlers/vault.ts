import { MarkdownView, TAbstractFile, TFile } from "obsidian";
import { AM } from "src/app/AppManager";

type EventHandlerForVaultMap = {
    rename: (file: TAbstractFile, oldPath: string) => any,
    delete: (file: TAbstractFile) => any,
    create: (file: TAbstractFile) => any,
    modify: (file: TAbstractFile) => any,
}
export type EventHandlerForVault<K extends keyof EventHandlerForVaultMap> = EventHandlerForVaultMap[K];

/*-------------------------------*/

const handleUpdateCacheWhenPathChanged: EventHandlerForVault<"rename"> = async (file: TAbstractFile, oldPath: string) => {
    if (!(file instanceof TFile)) return;
    AM.cache.updateCacheWhenPathChanged(file, oldPath);
}
const handlePromptAdaptToNewTFileToNote: EventHandlerForVault<"create"> = async (file) => {
    if (file instanceof TFile) {
        if (!file.path.startsWith("tmp/")) return;
        const rootNote = AM.note.getStdNote({ noteId: AM.noteHistory.latestId! })!;
        await AM.useCase.prompt.adaptTFileToNote(file, rootNote);

        const mdView = AM.obsidian.workspace.getActiveViewOfType(MarkdownView);

        if (mdView instanceof MarkdownView) {
            AM.looks.mountOrUpdateNoteTopSection(mdView);
        }
    }
}
const handleRecordTodayNoteIds: EventHandlerForVault<"modify"> = (file) => {
    if (file instanceof TFile) {

        if (!AM.orbiz.isVaultPath(file.path)) return;

        const id = AM.note.getNoteIdByTFile(file);
        if (!id) return;
        AM.diary.todayRecordNoteIds.mIds.add(id);
    }
}

/*-------------------------------*/

const handleListTAbstractFileRename: EventHandlerForVault<"rename">[] = [
    handleUpdateCacheWhenPathChanged
];
const handleListCreate: EventHandlerForVault<"create">[] = [
    handlePromptAdaptToNewTFileToNote
];
const handleListModify: EventHandlerForVault<"modify">[] = [
    handleRecordTodayNoteIds
];

/*-------------------------------*/

export const EventHandlersForVault = {
    "rename": handleListTAbstractFileRename,
    "create": handleListCreate,
    "modify": handleListModify,
}