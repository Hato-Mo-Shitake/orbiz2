import { Editor, EventRef, MarkdownFileInfo, MarkdownView, TAbstractFile, TFile } from "obsidian";
import { debugConsole } from "src/assistance/utils/debug";
import { OrbizMdView } from "src/looks/views/OrbizMdView";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { OEwM } from "src/orbiz/managers/OrbizEventWatchManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { OVM } from "src/orbiz/managers/OrbizViewManager";
import { handleListCacheChanged } from "../events/handlers/metadataCache";
import { handleListTAbstractFileRename } from "../events/handlers/vault";
import { handleListActiveLeafChange, handleListLayoutChange } from "../events/handlers/workspace";

// ゴリ押し。。。。
// interface HTMLElementWithOrbizNoteTopSectionRoot extends HTMLElement {
//     __reactRoot?: Root;
// }
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

        OAM().app.workspace.on("file-open", (tFile) => {
            // debugConsole("file-open");
            if (!tFile) return;
            // debugConsole(tFile.basename);


            const leaves = OAM().app.workspace.getLeavesOfType("markdown");
            leaves.forEach(leaf => {
                if (!(leaf.view instanceof MarkdownView)) return;

                const mdView = leaf.view;
                if (tFile.path !== mdView.file?.path) return;

                OVM().mountOrUpdateNoteTopSection(mdView);
            });
            // debugConsole("file-open-process end.");
        })

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

                    // if (Platform.isIosApp) {
                    //     new Notice("発動はしている。");
                    //     setTimeout(() => scrollCursorToCenter(editor), 3000);
                    // }
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
                debugConsole("judgeDateChange");
                ODM().judgeDateChange(new Date());
            }, 60 * 1000)
        );

        myPlugin.registerInterval(
            window.setInterval(() => {
                debugConsole("writeDailyLogNoteIds");
                ODM().writeDailyLogNoteIds();
            }, 30 * 60 * 1000)
        );
    }
}


// function scrollCursorToCenter(editor: Editor) {
//     // 現在のカーソル位置を取得
//     const cursor = editor.getCursor();

//     new Notice(cursor.line.toString());
//     // Obsidian の editor.scrollIntoView は範囲を指定できる
//     editor.scrollIntoView(
//         { from: cursor, to: cursor },
//         true  // `center: true` に相当、画面中央に持ってくる
//     );
// }