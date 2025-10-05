import { MarkdownView, PaneType, WorkspaceLeaf } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { Note } from "src/orbits/contracts/note-orb";
import { OAM } from "./OrbizAppManager";
import { OEM } from "./OrbizErrorManager";
import { ONhistoryM } from "./OrbizNoteHistoryManager";
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
        // const viewState = leaf.getViewState;
        await leaf.openFile(note.tFile);

        return leaf;
    }

    mountOrUpdateNoteTopSection(mdView: MarkdownView) {
        console.log("このタイミングで、開いたノート順の履歴管理", mdView.file!.name);

        // debugConsole("このタイミングで、開いたノート順の履歴管理", mdView.file!.name);

        const metadataContainer = mdView.containerEl.querySelector(".metadata-container");
        if (!(metadataContainer instanceof HTMLElement)) return;
        const tFile = mdView.file;
        if (!tFile) return;
        const orb = OOM().getNoteOrb({ tFile });
        if (!orb) return;


        // あとでidにかえます。
        ONhistoryM().setNoteHistory(orb.note.baseName);

        const entry = this.containerRootMap.get(metadataContainer);

        if (entry) {
            // 既存 root を再利用して再レンダリング
            // debugConsole("再レンダリング", this.containerRootMap);
            // new Notice("再レンダリング");


            // ここで、ノートが切り替わった先で、元のコンポーネントが残ることがある。

            // entry.root.unmount();
            entry.root.render(orb.viewer.getTopSection());
            // entry.root.render(<NoteTopSection tFile={tFile} />);





            return;
        }

        // 新規 root 作成
        const topSectionContainer = document.createElement("div");
        metadataContainer.appendChild(topSectionContainer);
        const root = createRoot(topSectionContainer);




        root.render(
            orb.viewer.getTopSection()
        );
        // root.render(<NoteTopSection tFile={tFile} />);




        // metadata-container 削除監視
        // NOTE: thisとアロー関数の関係に注意。functionは使わない。
        const observer = new MutationObserver(() => {
            const entry = this.containerRootMap.get(metadataContainer);
            if (!entry) return; // 削除済み？

            if (!document.body.contains(metadataContainer)) {
                // debugConsole("unmountされます。", this.containerRootMap);
                entry.root.unmount();
                entry.observer.disconnect();
                this.containerRootMap.delete(metadataContainer);
                // new Notice("unmountされました。");
                // debugConsole("unmountされました。", this.containerRootMap);
            }
        });
        observer.observe(mdView.containerEl, { childList: true, subtree: true });

        this.containerRootMap.set(metadataContainer, { root, observer });
        // new Notice("新規rootが作成されました。");
        // debugConsole("新規rootが作成されました。", this.containerRootMap);
    }

    // reloadNoteTopSection(tFile: TFile) {
    //     const metadataContainer = mdView.containerEl.querySelector(".metadata-container");
    // }

    // get aliveMdView(): MarkdownView[] {
    //     const { app } = OAM();
    //     const views: MarkdownView[] = [];
    //     app.workspace.iterateAllLeaves(leaf => {
    //         if (leaf.view instanceof MarkdownView) {
    //             views.push(leaf.view);
    //         }
    //     })
    //     return views;
    // }

    // get aliveStdNoteView(): StdNoteView[] {
    //     const { app } = OAM();
    //     const views: StdNoteView[] = [];
    //     app.workspace.iterateAllLeaves(leaf => {
    //         if (
    //             leaf.view instanceof OrbizMdView
    //             && leaf.view.noteOrb instanceof StdNoteOrb
    //         ) {
    //             views.push(leaf.view as StdNoteView);
    //         }
    //     })
    //     return views;
    // }

    // get aliveOrbizMdView(): OrbizMdView[] {
    //     const { app } = OAM();
    //     const views: OrbizMdView[] = [];
    //     app.workspace.iterateAllLeaves(leaf => {
    //         if (leaf.view instanceof OrbizMdView) {
    //             views.push(leaf.view);
    //         }
    //     })
    //     return views;
    // }

    // reloadStdNoteViews() {
    //     // TODO：全リロードのコストが重くなった時は、リロードすべきorbをcommit時とかに判定して、
    //     // 更新すべき対象のnoteIdを、App全体の状態を管理するクラスの変数に持たせてもいい。
    //     this.aliveStdNoteView.forEach(view => {
    //         view.reload();
    //     });
    // }

    // async setOrbizMdView(leaf: WorkspaceLeaf) {
    //     const view = leaf.view;
    //     if (!(view instanceof MarkdownView)) return;

    // const tFile = view.file;
    // if (!tFile) return;
    // const orb = OOM().getNoteOrb({ tFile: tFile });

    // if (!orb) return;
    // if (view.containerEl.querySelector(".orbiz-note-top-section")) {
    //     return;
    // }

    // const metadataContainer = view.containerEl.querySelector(".metadata-container") as HTMLElement;
    // if (!metadataContainer) OEM.throwUnexpectedError();
    // const tmpEl = document.createElement("div");
    // metadataContainer.insertAdjacentElement("afterend", tmpEl);
    // const root = createRoot(tmpEl);

    // root.render(
    //     <>
    //         <div className="orbiz-note-top-section">
    //             {orb.viewer.getTopSection()}
    //             < div > テスト中7 </div>
    //         </div>
    //     </>
    // );

    // view.addChild(new OrbizMdView(view.leaf));

    // const path = view.file?.path;
    // if (!path) return;
    // if (!OAM().isVaultPath(path)) return;

    // const tFile = view.file;
    // if (!tFile) return;

    // const viewState = leaf.getViewState();
    // viewState.type = VIEW_TYPE_ORBIZ_MD;

    // await leaf.setViewState(viewState);



    // }
}

export const OVM = () => {
    return OrbizViewManager.getInstance();
}