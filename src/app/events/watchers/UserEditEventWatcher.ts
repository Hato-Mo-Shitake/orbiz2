import { Editor, MarkdownFileInfo, MarkdownView } from "obsidian";

type UserEditAfterHandler = () => void;
export class UserEditEventWatcher {
    private _editingTimers = new Map<string, number>();
    private readonly _doneTypingInterval = 3000;

    private readonly _callbackOnceAfterEdit = new Map<string, UserEditAfterHandler>();

    get isEdited(): boolean {
        return Boolean(this._editingTimers.size);
    }

    get editedNoteIds(): string[] {
        return Array.from(this._editingTimers.keys());
    }

    public watchOnceAfterEdit(noteId: string, callback: UserEditAfterHandler) {
        this._callbackOnceAfterEdit.set(noteId, callback);
    }

    userEdit(noteId: string, editor: Editor, info: MarkdownView | MarkdownFileInfo) {
        // console.log("入力！");

        const existingTimer = this._editingTimers.get(noteId);
        if (existingTimer) clearTimeout(existingTimer);

        const timerId = window.setTimeout(() => {
            // console.log("入力終了!");

            try {
                const cb = this._callbackOnceAfterEdit.get(noteId);
                if (cb) cb();
            } finally {
                this._editingTimers.delete(noteId);
                this._callbackOnceAfterEdit.delete(noteId);
            }

        }, this._doneTypingInterval);

        this._editingTimers.set(noteId, timerId);
    }
}