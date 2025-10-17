import { View, WorkspaceLeaf } from "obsidian";
import { AM } from "src/app/AppManager";
import { VIEW_TYPE_REACT_EXAMPLE } from "src/looks/views/ReactExampleView";
import { ViewType } from "src/orbits/contracts/view";


export class ViewActivator {
    async activateExampleView() {
        // const { workspace } = OAM().app;
        const { workspace } = AM.obsidian;

        let leaf: WorkspaceLeaf | null = null;
        // const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);
        const leaves = workspace.getLeavesOfType(VIEW_TYPE_REACT_EXAMPLE);

        if (leaves.length > 0) {
            // A leaf with our view already exists, use that
            leaf = leaves[0];
        } else {
            // Our view could not be found in the workspace, create a new leaf
            // in the right sidebar for it
            leaf = workspace.getRightLeaf(false);
            // await leaf?.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
            await leaf?.setViewState({ type: VIEW_TYPE_REACT_EXAMPLE, active: true });
        }

        if (!leaf) return;

        // "Reveal" the leaf in case it is in a collapsed sidebar
        workspace.revealLeaf(leaf);
    }

    async openNewView(viewType: ViewType): Promise<WorkspaceLeaf> {

        // const leaf = OAM().app.workspace.getLeaf(true);
        const leaf = AM.obsidian.workspace.getLeaf(true);

        await leaf.setViewState({ type: viewType, active: true });

        // OAM().ws.revealLeaf(leaf);
        AM.obsidian.workspace.revealLeaf(leaf);

        return leaf;
    }

    async setViewInActiveLeaf(viewType: ViewType): Promise<WorkspaceLeaf | null> {
        // const ws = OAM().ws;
        const ws = AM.obsidian.workspace;
        const view = ws.getActiveViewOfType(View);
        const leaf = view?.leaf;
        if (!leaf) return null;

        console.log(leaf?.getViewState());
        // const leaf = OAM().ws.getLeaf(false);
        // console.log("現在のリーフが欲しいのに");
        // console.log(leaf.view.getViewType())




        const viewState = leaf!.getViewState();
        // console.log(viewState);
        viewState.type = viewType;
        // await leaf?.setViewState(viewState);
        await leaf.setViewState({ type: viewType, active: true });
        // OAM().ws.revealLeaf(leaf);
        // await leaf.setViewState({ type: viewType, active: true });
        // OAM().ws.revealLeaf(leaf);
        return leaf;
    }
}