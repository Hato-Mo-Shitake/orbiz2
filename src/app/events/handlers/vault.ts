import { MarkdownView, TAbstractFile, TFile } from "obsidian";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { ONhistoryM } from "src/orbiz/managers/OrbizNoteHistoryManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { OUM } from "src/orbiz/managers/OrbizUseCaseManager";
import { OVM } from "src/orbiz/managers/OrbizViewManager";

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
    OCM().updateCacheWhenPathChanged(file, oldPath);
}
const handlePromptAdaptToNewTFileToNote: EventHandlerForVault<"create"> = async (file) => {
    if (file instanceof TFile) {
        if (!file.path.startsWith("tmp/")) return;
        const rootNote = ONM().getStdNote({ noteId: ONhistoryM().latestId! })!;
        await OUM().prompt.adaptTFileToNote(file, rootNote);

        const mdView = OAM().app.workspace.getActiveViewOfType(MarkdownView);
        if (mdView instanceof MarkdownView) {
            OVM().mountOrUpdateNoteTopSection(mdView);
        }
    }
}
const handleRecordTodayNoteIds: EventHandlerForVault<"modify"> = (file) => {
    if (file instanceof TFile) {
        if (!OAM().isVaultPath(file.path)) return;
        const id = ONM().getNoteIdByTFile(file);
        if (!id) return;
        ODM().todayRecordNoteIds.mIds.add(id);
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