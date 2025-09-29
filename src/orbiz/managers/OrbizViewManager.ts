import { MarkdownView, PaneType, WorkspaceLeaf } from "obsidian";
import { StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { OrbizMdView, StdNoteView, VIEW_TYPE_ORBIZ_MD } from "src/looks/views/OrbizMdView";
import { Note } from "src/orbits/contracts/note-orb";
import { OAM } from "./OrbizAppManager";
import { OEM } from "./OrbizErrorManager";

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

    private constructor() { }

    async openNote(note: Note, newLeaf?: PaneType | boolean): Promise<WorkspaceLeaf> {
        const leaf = OAM().app.workspace.getLeaf(newLeaf);
        // const viewState = leaf.getViewState;
        await leaf.openFile(note.tFile);

        return leaf;
    }

    get aliveStdNoteView(): StdNoteView[] {
        const { app } = OAM();
        const views: StdNoteView[] = [];
        app.workspace.iterateAllLeaves(leaf => {
            if (
                leaf.view instanceof OrbizMdView
                && leaf.view.noteOrb instanceof StdNoteOrb
            ) {
                views.push(leaf.view as StdNoteView);
            }
        })
        return views;
    }

    get aliveOrbizMdView(): OrbizMdView[] {
        const { app } = OAM();
        const views: OrbizMdView[] = [];
        app.workspace.iterateAllLeaves(leaf => {
            if (leaf.view instanceof OrbizMdView) {
                views.push(leaf.view);
            }
        })
        return views;
    }

    reloadStdNoteViews() {
        // TODO：全リロードのコストが重くなった時は、リロードすべきorbをcommit時とかに判定して、
        // 更新すべき対象のnoteIdを、App全体の状態を管理するクラスの変数に持たせてもいい。
        this.aliveStdNoteView.forEach(view => {
            view.reload();
        });
    }

    async setOrbizMdView(leaf: WorkspaceLeaf) {
        const view = leaf.view;
        if (!(view instanceof MarkdownView)) return;
        const path = view.file?.path;
        if (!path) return;
        if (!OAM().isVaultPath(path)) return;

        const tFile = view.file;
        if (!tFile) return;

        const viewState = leaf!.getViewState();
        viewState.type = VIEW_TYPE_ORBIZ_MD;

        await leaf?.setViewState(viewState);
    }
}

export const OVM = () => {
    return OrbizViewManager.getInstance();
}