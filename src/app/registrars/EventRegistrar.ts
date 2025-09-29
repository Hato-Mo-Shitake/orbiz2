import { Editor, EventRef, MarkdownFileInfo, MarkdownView, TAbstractFile, TFile } from "obsidian";
import { OrbizMdView } from "src/looks/views/OrbizMdView";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { OEwM } from "src/orbiz/managers/OrbizEventWatchManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { handleListCacheChanged } from "../events/handlers/metadataCache";
import { handleListTAbstractFileRename } from "../events/handlers/vault";
import { handleListActiveLeafChange, handleListLayoutChange } from "../events/handlers/workspace";

export class EventRegistrar {
    private readonly eventRefs: EventRef[] = [];

    constructor() { }

    register(): void {
        const { myPlugin } = OAM();

        /** workspace */
        handleListActiveLeafChange.forEach(handle => {
            OEwM().workspaceWatcher.watchOnActiveLeafChange(handle);
        });
        handleListLayoutChange.forEach(handle => {
            OEwM().workspaceWatcher.watchOnLayoutChange(handle);
        });

        /** vault */
        handleListTAbstractFileRename.forEach(handle => {
            OEwM().vaultWatcher.watchOnRename(handle);
        });

        /** metadataCache */
        handleListCacheChanged.forEach(handle => {
            OEwM().metadataCacheWatcher.watchOnCacheChanged(handle);
        });

        myPlugin.registerEvent(
            OAM().app.workspace.on("editor-change", (editor: Editor, info: MarkdownView | MarkdownFileInfo) => {
                if (info instanceof OrbizMdView) {
                    const noteId = info?.noteOrb?.note.id || null;
                    if (!noteId) return;
                    OEwM().userEditWatcher.userEdit(noteId, editor, info);
                }
            })
        );

        myPlugin.registerEvent(OAM().app.vault.on("modify", (file: TAbstractFile) => {
            if (file instanceof TFile) {
                if (!OAM().isVaultPath(file.path)) return;
                const id = ONM().getNoteIdByTFile(file);
                if (!id) return;
                ODM().todayRecordNoteIds.mIds.add(id);
            }
        }));

        // TODO: うるさいのでコメントアウト
        // myPlugin.registerDomEvent(document, 'click', (evt: MouseEvent) => {
        //     console.log('click!!', evt);
        // });

        // myPlugin.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
        myPlugin.registerInterval(
            window.setInterval(() => {
                console.log("judgeDateChange");
                ODM().judgeDateChange(new Date());
            }, 60 * 1000)
        );

        myPlugin.registerInterval(
            window.setInterval(() => {
                console.log("writeDailyLogNoteIds");
                ODM().writeDailyLogNoteIds();
            }, 30 * 60 * 1000)
        );
    }
}
