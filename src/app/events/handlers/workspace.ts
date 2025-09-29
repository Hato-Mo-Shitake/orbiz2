import { WorkspaceLeaf } from "obsidian";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { OVM } from "src/orbiz/managers/OrbizViewManager";

export type LayoutChangeHandler = () => any;
export type ActiveLeafChangeHandler = (leaf: WorkspaceLeaf | null) => any;
const handleSetOrbizMdView: ActiveLeafChangeHandler = async (leaf: WorkspaceLeaf | null) => {
    const view = leaf?.view;
    if (!view) return;
    OVM().setOrbizMdView(leaf);
}

export const handleUpdateNoteOrbCaches: LayoutChangeHandler = async () => {
    OCM().updateNoteOrbCaches();
}

export const handleListActiveLeafChange: ActiveLeafChangeHandler[] = [
    handleSetOrbizMdView
];
export const handleListLayoutChange: LayoutChangeHandler[] = [
    handleUpdateNoteOrbCaches
];
