import { Editor, EventRef, MarkdownFileInfo, MarkdownView, TAbstractFile, TFile } from "obsidian";
import { debugConsole } from "src/assistance/utils/debug";
import { iterateNoteLines } from "src/assistance/utils/editor";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { OEwM } from "src/orbiz/managers/OrbizEventWatchManager";
import { ONhistoryM } from "src/orbiz/managers/OrbizNoteHistoryManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { OUM } from "src/orbiz/managers/OrbizUseCaseManager";
import { OVM } from "src/orbiz/managers/OrbizViewManager";
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


        OAM().app.workspace.on("file-open", (tFile) => {
            if (!tFile) return;

            const leaves = OAM().app.workspace.getLeavesOfType("markdown");
            leaves.forEach(leaf => {
                if (!(leaf.view instanceof MarkdownView)) return;

                const mdView = leaf.view;
                if (tFile.path !== mdView.file?.path) return;

                OVM().mountOrUpdateNoteTopSection(mdView);
            });
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
                if (info instanceof MarkdownView) {
                    const tFile = info?.file || null;
                    if (!tFile) return;
                    const noteId = ONM().getNoteIdByTFile(tFile);
                    if (!noteId) return;
                    OEwM().userEditWatcher.userEdit(noteId, editor, info);
                }
            })
        );

        myPlugin.registerEvent(OAM().app.vault.on("create", async (file: TAbstractFile) => {
            if (file instanceof TFile) {
                if (!file.path.startsWith("tmp/")) return;
                const rootNote = ONM().getStdNote({ noteId: ONhistoryM().latestId! })!;
                OUM().prompt.adaptTFileToNote(file, rootNote);
            }
        }));

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
        myPlugin.registerDomEvent(document, 'click', async (evt: MouseEvent) => {
            const target = evt.target;
            if (!(target instanceof HTMLElement)) return;
            const btn = target.closest<HTMLButtonElement>(".add-unlinked-std-note-btn");
            if (!btn) return;
            const unlinkedNoteId = btn?.dataset.unlinkedNoteId;
            const rootNoteId = btn?.dataset.rootNoteId;
            // debugConsole("未関連ノート追加ボタンが押されたよ。", "unlinked-note", unlinkedNoteId, "roo-note", rootNoteId);
            if (!unlinkedNoteId || !rootNoteId) return;
            const unlinkedNote = ONM().getStdNote({ noteId: unlinkedNoteId })!;
            const rootNote = ONM().getStdNote({ noteId: rootNoteId })!;
            const success = await OUM().prompt.addLinkedNote(unlinkedNote, rootNote);

            if (!success) return;

            const mdView = OAM().app.workspace.getActiveViewOfType(MarkdownView);
            const tFile = mdView?.file;

            if (rootNote.path != tFile?.path || !mdView?.editor) {
                alert("想定外のエラーです。手動で対象の「added」ボタンを除去して。");
                return;
            }

            const editor = mdView.editor;
            const deleteBtnText = `<button class="add-unlinked-std-note-btn" data-unlinked-note-id="${unlinkedNoteId}" data-root-note-id="${rootNoteId}">added</button>`;

            let deleteSuccess = false;
            iterateNoteLines(editor, (line, lineText) => {
                if (!lineText.includes(deleteBtnText)) return;
                const newLine = lineText
                    .replace("【@ ", "")
                    .replace(" @】", "")
                    .replace(deleteBtnText, "");


                const from = { line: line, ch: 0 };
                const to = { line: line, ch: lineText.length };
                editor.blur();

                // debugConsole("未関連ノートを検知。ボタンを設置します。");
                editor.replaceRange(newLine, from, to);
                deleteSuccess = true;
            });

            // if (rootNote.path != tFile?.path || !mdView?.editor) {
            if (!deleteSuccess) {
                alert("想定外のエラーです。手動で対象の「added」ボタンを除去して。");
            }
            // }
        });

        // myPlugin.registerDomEvent("document", "paste")

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