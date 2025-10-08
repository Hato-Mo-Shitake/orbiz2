import { MarkdownView, PaneType, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { Note } from "src/orbits/contracts/note-orb";
import { OAM } from "./OrbizAppManager";
import { OEM } from "./OrbizErrorManager";
import { ONhistoryM } from "./OrbizNoteHistoryManager";
import { ONM } from "./OrbizNoteManager";
import { OOM } from "./OrbizOrbManager";

interface RootEntry {
    root: Root;
    observer: MutationObserver;
}
export class OrbizViewManager {
    private static _instance: OrbizViewManager | null;

    static setInstance() {
        OrbizViewManager._instance = new OrbizViewManager();
    }

    static getInstance(): OrbizViewManager {
        const instance = OrbizViewManager._instance;
        if (!instance) OEM.throwNotInitializedError();

        return instance;
    }

    readonly containerRootMap: Map<HTMLElement, RootEntry> = new Map();
    private constructor() { }

    async openNote(note: Note, newLeaf?: PaneType | boolean): Promise<WorkspaceLeaf> {
        const leaf = OAM().app.workspace.getLeaf(newLeaf);
        await leaf.openFile(note.tFile);

        return leaf;
    }

    mountOrUpdateNoteTopSection(mdView: MarkdownView) {

        const metadataContainer = mdView.containerEl.querySelector(".metadata-container");
        if (!(metadataContainer instanceof HTMLElement)) return;
        const tFile = mdView.file;

        if (!tFile) return;
        if (!ONM().isNotePath(tFile.path)) return;

        const orb = OOM().getNoteOrb({ tFile });
        if (!orb) return;

        // 履歴管理。
        ONhistoryM().setNoteHistory(orb.note.id);

        const entry = this.containerRootMap.get(metadataContainer);

        if (entry) {
            entry.root.render(orb.viewer.getTopSection());
            return;
        }

        // 新規 root 作成
        const topSectionContainer = document.createElement("div");
        metadataContainer.appendChild(topSectionContainer);
        const root = createRoot(topSectionContainer);

        root.render(
            orb.viewer.getTopSection()
        );

        // metadata-container 削除監視
        // NOTE: thisとアロー関数の関係に注意。functionは使わない。
        const observer = new MutationObserver(() => {
            const entry = this.containerRootMap.get(metadataContainer);
            if (!entry) return; // 削除済み？

            if (!document.body.contains(metadataContainer)) {
                entry.root.unmount();
                entry.observer.disconnect();
                this.containerRootMap.delete(metadataContainer);
            }
        });
        observer.observe(mdView.containerEl, { childList: true, subtree: true });

        this.containerRootMap.set(metadataContainer, { root, observer });
    }
}

export const OVM = () => {
    return OrbizViewManager.getInstance();
}