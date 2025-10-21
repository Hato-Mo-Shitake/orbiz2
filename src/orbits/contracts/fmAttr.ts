import { TFile } from "obsidian";
import { ReactNode } from "react";
import { AllFmKey } from "../schema/frontmatters/FmKey";
import { Observer } from "./observer";

// export interface FmAttrSelectable<TAVal = any> extends FmAttrEditor<TAVal[]>, FmAttrViewer<TAVal[]> {
//     selections: string[];
// }
export interface FmAttrList<TAVal = any> extends FmAttrEditor<TAVal[]>, FmAttrViewer<TAVal[]> {
    addNewAVal: (aVal: TAVal) => void;
    // deleteNewAVal: (aVal: TAVal) => void;
    validateAVal: (aVal: TAVal) => void;
    filterAVal: (aVal: TAVal) => void;
}

export interface FmAttrReader<TValue = any> {
    // noteId: string,
    tFile: TFile,
    fmKey: AllFmKey;
    value: TValue | null,
    isImmutable: boolean;
}

export interface FmAttrEditor<TValue = any> extends FmAttrReader<TValue>, Observer<TValue> {
    newValue: TValue | undefined,
    setNewValue(newValue: TValue): this;
    commitNewValue(): Promise<void>;
    forcedUpdate(value: TValue): Promise<void>;
}
export function isFmAttrEditor(editor: unknown): editor is FmAttrEditor<any> {
    return (
        editor !== null &&
        typeof editor === "object" &&
        typeof (editor as any).isUpdatable === "boolean" &&
        "newValue" in editor &&
        typeof (editor as any).setNewValue === "function" &&
        typeof (editor as any).commitNewValue === "function"
    );
}

export interface FmAttrViewer<TValue = any> extends FmAttrReader<TValue>, Observer<TValue> {
    // getLooks(): ReactNode;
    // getEditBox(): ReactNode;
    getView(options?: any): ReactNode;
    getEditableView(): ReactNode;
    getForcedEditableView?(): ReactNode;
}
export function isFmAttrViewer(viewer: unknown): viewer is FmAttrViewer {
    return (
        viewer !== null &&
        typeof viewer === "object" &&
        typeof (viewer as any).getLooks === "function" &&
        typeof (viewer as any).getEditBox === "function"
    );
}