import { OEM } from "./OrbizErrorManager";

export class OrbizNoteHistoryManager {
    private static _instance: OrbizNoteHistoryManager | null = null;

    static setInstance(
    ): void {
        this._instance = new OrbizNoteHistoryManager();
    }

    static getInstance(): OrbizNoteHistoryManager {
        if (!this._instance) OEM.throwNotInitializedError(OrbizNoteHistoryManager);

        return this._instance;
    }

    /** ------------ */

    private openedNotes = new Set<string>();
    private idHistory: string[] = [];
    private constructor(
    ) {
    }

    /**
     * ノート履歴を更新（既存なら順序更新、なければ追加）
     * 最新ノートが index 0 になる
     */
    setNoteHistory(noteId: string) {
        // すでに履歴に存在する場合は古い位置を削除
        if (this.openedNotes.has(noteId)) {
            const idx = this.idHistory.indexOf(noteId);
            if (idx !== -1) this.idHistory.splice(idx, 1);
        } else {
            this.openedNotes.add(noteId);
        }

        // 先頭に追加（最新ノートがindex0）
        this.idHistory.unshift(noteId);
    }

    /** 最新のノートを取得 */
    getLatest(): string | null {
        return this.idHistory[0] ?? null;
    }

    /** 履歴（新しい順）を取得 */
    getAllDesc(): string[] {
        return [...this.idHistory];
    }

    /** 履歴（古い順）を取得 */
    getAllAsc(): string[] {
        return [...this.idHistory].reverse();
    }

    /** 履歴をクリア */
    clear() {
        this.openedNotes.clear();
        this.idHistory = [];
    }
}

export const ONhistoryM = () => {
    return OrbizNoteHistoryManager.getInstance();
}