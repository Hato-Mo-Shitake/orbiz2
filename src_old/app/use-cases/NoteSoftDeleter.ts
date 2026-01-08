import { MarkdownView, TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { getCurrentYearMonth } from "src/assistance/utils/date";
import { PromptBoolModal } from "src/looks/modals/prompt/PromptBoolModal";

export class NoteSoftDeleter {
    async trashNote(tFile: TFile): Promise<string | null> {
        const flag = await PromptBoolModal.get(`Are you sure you want to trash ${tFile.name}：   `);

        if (!flag) {
            return null;
        }

        const noteR = AM.repository.noteR;
        await noteR.upsertFmAttrs(tFile, {
            "oldPath": tFile.path,
        });

        const trashDirPath = `____/trash/${AM.orbiz.rootDir}${getCurrentYearMonth()}`;
        const newName = `@Trashed@${tFile.name}`

        const ws = AM.obsidian.workspace;
        const view = ws.getActiveViewOfType(MarkdownView);
        view?.leaf.detach();
        const newPath = await noteR.changeTFileDir(tFile, trashDirPath, { newFileName: newName });

        if (!newPath) {
            alert("trashing failed.");
            return null;
        }

        const leaf = ws.getLeaf();
        leaf.openFile(tFile);

        return newPath;
    }
}