import { OEwM } from "src/orbiz/managers/OrbizEventWatchManager";
import { EventHandlersForDocument } from "../events/handlers/document";
import { EventHandlersForInterval } from "../events/handlers/interval";
import { EventHandlersForMetadataCache } from "../events/handlers/metadataCache";
import { EventHandlersForVault } from "../events/handlers/vault";
import { EventHandlersForWorkspace } from "../events/handlers/workspace";

export class EventRegistrar {
    // private readonly eventRefs: EventRef[] = [];

    constructor() { }

    register(): void {
        // const { myPlugin } = OAM();

        /** workspace */
        EventHandlersForWorkspace.activeLeafChange.forEach(handle => {
            OEwM().workspaceWatcher.watchOnActiveLeafChange(handle);
        });
        EventHandlersForWorkspace.layoutChange.forEach(handle => {
            OEwM().workspaceWatcher.watchOnLayoutChange(handle);
        });
        EventHandlersForWorkspace.fileOpen.forEach(handle => {
            OEwM().workspaceWatcher.watchOnFileOpen(handle);
        });
        // OAM().app.workspace.on("file-open", (tFile) => {
        //     if (!tFile) return;

        //     const leaves = OAM().app.workspace.getLeavesOfType("markdown");
        //     leaves.forEach(leaf => {
        //         if (!(leaf.view instanceof MarkdownView)) return;

        //         const mdView = leaf.view;
        //         if (tFile.path !== mdView.file?.path) return;

        //         OVM().mountOrUpdateNoteTopSection(mdView);
        //     });
        // })
        EventHandlersForWorkspace.editorChange.forEach(handle => {
            OEwM().workspaceWatcher.watchOnEditorChange(handle);
        });
        // myPlugin.registerEvent(
        //     OAM().app.workspace.on("editor-change", (editor: Editor, info: MarkdownView | MarkdownFileInfo) => {
        //         if (info instanceof MarkdownView) {
        //             const tFile = info?.file || null;
        //             if (!tFile) return;
        //             const noteId = ONM().getNoteIdByTFile(tFile);
        //             if (!noteId) return;
        //             OEwM().userEditWatcher.userEdit(noteId, editor, info);
        //         }
        //     })
        // );





        /** vault */
        EventHandlersForVault.rename.forEach(handle => {
            OEwM().vaultWatcher.watchOnRename(handle);
        });

        EventHandlersForVault.create.forEach(handle => {
            OEwM().vaultWatcher.watchOnCreate(handle);
        });
        // myPlugin.registerEvent(OAM().app.vault.on("create", async (file: TAbstractFile) => {
        //     if (file instanceof TFile) {
        //         if (!file.path.startsWith("tmp/")) return;
        //         const rootNote = ONM().getStdNote({ noteId: ONhistoryM().latestId! })!;
        //         OUM().prompt.adaptTFileToNote(file, rootNote);
        //     }
        // }));

        EventHandlersForVault.modify.forEach(handle => {
            OEwM().vaultWatcher.watchOnModify(handle);
        });
        // myPlugin.registerEvent(OAM().app.vault.on("modify", (file: TAbstractFile) => {
        //     if (file instanceof TFile) {
        //         if (!OAM().isVaultPath(file.path)) return;
        //         const id = ONM().getNoteIdByTFile(file);
        //         if (!id) return;
        //         ODM().todayRecordNoteIds.mIds.add(id);
        //     }
        // }));


        /** metadataCache */
        EventHandlersForMetadataCache.changed.forEach(handle => {
            OEwM().metadataCacheWatcher.watchOnCacheChanged(handle);
        });


        /** document */
        // myPlugin.registerDomEvent(document, 'click', (evt: MouseEvent) => {
        //     console.log('click!!', evt);
        // });
        EventHandlersForDocument.click.forEach(handle => {
            OEwM().documentWatcher.watchOnClick(handle);
        });
        // myPlugin.registerDomEvent(document, 'click', async (evt: MouseEvent) => {
        //     const target = evt.target;
        //     if (!(target instanceof HTMLElement)) return;
        //     const btn = target.closest<HTMLButtonElement>(".add-unlinked-std-note-btn");
        //     if (!btn) return;
        //     const unlinkedNoteId = btn?.dataset.unlinkedNoteId;
        //     const rootNoteId = btn?.dataset.rootNoteId;
        //     if (!unlinkedNoteId || !rootNoteId) return;
        //     const unlinkedNote = ONM().getStdNote({ noteId: unlinkedNoteId })!;
        //     const rootNote = ONM().getStdNote({ noteId: rootNoteId })!;
        //     const success = await OUM().prompt.addLinkedNote(unlinkedNote, rootNote);

        //     if (!success) return;

        //     const mdView = OAM().app.workspace.getActiveViewOfType(MarkdownView);
        //     const tFile = mdView?.file;

        //     if (rootNote.path != tFile?.path || !mdView?.editor) {
        //         alert("想定外のエラーです。手動で対象の「added」ボタンを除去して。");
        //         return;
        //     }

        //     const editor = mdView.editor;
        //     const deleteBtnText = `<button class="add-unlinked-std-note-btn" data-unlinked-note-id="${unlinkedNoteId}" data-root-note-id="${rootNoteId}">added</button>`;

        //     let deleteSuccess = false;
        //     iterateNoteLines(editor, (line, lineText) => {
        //         if (!lineText.includes(deleteBtnText)) return;
        //         const newLine = lineText
        //             .replace("【@ ", "")
        //             .replace(" @】", "")
        //             .replace(deleteBtnText, "");


        //         const from = { line: line, ch: 0 };
        //         const to = { line: line, ch: lineText.length };
        //         editor.blur();

        //         editor.replaceRange(newLine, from, to);
        //         deleteSuccess = true;
        //     });

        //     if (!deleteSuccess) {
        //         alert("想定外のエラーです。手動で対象の「added」ボタンを除去して。");
        //     }
        // });

        // myPlugin.registerDomEvent("document", "paste")




        /** interval */
        // myPlugin.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
        EventHandlersForInterval.forEach(handler => {
            OEwM().intervaleWatcher.watch(handler);
        })
        // myPlugin.registerInterval(
        //     window.setInterval(() => {
        //         debugConsole("judgeDateChange");
        //         ODM().judgeDateChange(new Date());
        //     }, 60 * 1000)
        // );

        // myPlugin.registerInterval(
        //     window.setInterval(() => {
        //         debugConsole("writeDailyLogNoteIds");
        //         ODM().writeDailyLogNoteIds();
        //     }, 30 * 60 * 1000)
        // );
    }
}