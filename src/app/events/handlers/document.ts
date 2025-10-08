import { MarkdownView } from "obsidian";
import { iterateNoteLines } from "src/assistance/utils/editor";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { OUM } from "src/orbiz/managers/OrbizUseCaseManager";

type EventHandlerForDocumentMap = {
    click: (evt: MouseEvent) => any,
}
export type EventHandlerForDocument<K extends keyof EventHandlerForDocumentMap> = EventHandlerForDocumentMap[K];

/*-------------------------------*/

const handleAddLinkedNote: EventHandlerForDocument<"click"> = async (evt: MouseEvent) => {
    const target = evt.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest<HTMLButtonElement>(".add-unlinked-std-note-btn");
    if (!btn) return;
    const unlinkedNoteId = btn?.dataset.unlinkedNoteId;
    const rootNoteId = btn?.dataset.rootNoteId;
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

        editor.replaceRange(newLine, from, to);
        deleteSuccess = true;
    });

    if (!deleteSuccess) {
        alert("想定外のエラーです。手動で対象の「added」ボタンを除去して。");
    }
}

/*-------------------------------*/

const handleListClick: EventHandlerForDocument<"click">[] = [
    handleAddLinkedNote
];

/*-------------------------------*/

export const EventHandlersForDocument = {
    "click": handleListClick,
}