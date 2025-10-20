import { MarkdownView, PaneType, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { AM } from "src/app/AppManager";
import { NotInitializedError } from "src/errors/NotInitializedError";
import { Note } from "src/orbits/contracts/note-orb";


interface RootEntry {
    root: Root;
    observer: MutationObserver;
}
export class LooksManager {
    private static _instance: LooksManager | null;

    static setInstance() {
        LooksManager._instance = new LooksManager();
    }

    static getInstance(): LooksManager {
        const instance = LooksManager._instance;
        if (!instance) throw new NotInitializedError();
        //  OEM.throwNotInitializedError();

        return instance;
    }

    readonly containerRootMap: Map<HTMLElement, RootEntry> = new Map();
    private constructor() { }

    async openNote(note: Note, newLeaf?: PaneType | boolean): Promise<WorkspaceLeaf> {
        // const leaf = OAM().app.workspace.getLeaf(newLeaf);
        const leaf = AM.obsidian.workspace.getLeaf(newLeaf);
        await leaf.openFile(note.tFile);

        return leaf;
    }

    mountOrUpdateNoteTopSection(mdView: MarkdownView) {
        const metadataContainer = mdView.containerEl.querySelector(".metadata-container");
        if (!(metadataContainer instanceof HTMLElement)) return;
        const tFile = mdView.file;

        if (!tFile) return;
        if (!AM.note.isNotePath(tFile.path)) return;

        const orb = AM.orb.getNoteOrb({ tFile });
        if (!orb) return;

        // 履歴管理。
        AM.noteHistory.setNoteHistory(orb.note.id);

        const entry = this.containerRootMap.get(metadataContainer);

        if (entry) {
            entry.root.render(orb.viewer.getTopSection());
            return;
        }

        // 新規 root 作成
        const topSectionContainer = document.createElement("div");
        topSectionContainer.addClass("top-section-container")
        // metadataContainer.appendChild(topSectionContainer);
        metadataContainer.insertAdjacentElement("afterend", topSectionContainer);
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