import { TFile } from "obsidian";
import { ReactNode } from "react";
import { AM } from "src/app/AppManager";
import { FmAttrEditor, FmAttrViewer } from "src/orbits/contracts/fmAttr";
import { FmKey } from "src/orbits/contracts/fmKey";
import { Listener } from "src/orbits/contracts/observer";
import { BaseNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";

export abstract class FmAttr<TValue = any, TNoteState extends BaseNoteState = BaseNoteState> implements FmAttrEditor<TValue>, FmAttrViewer<TValue> {
    protected _newValue: TValue | undefined = undefined;

    protected _listeners = new Set<Listener<TValue | null>>();
    protected _caches: Partial<Record<string, any>> = {};

    protected _store: StoreApi<TNoteState> | null = null;
    protected _storeGetter: (() => TValue | null) | null = null;
    protected _storeSetter: ((value: TValue) => void) | null = null;

    constructor(
        readonly tFile: TFile,
        readonly fmKey: FmKey,
        readonly isImmutable: boolean,
        protected _value: TValue | null,
    ) {
        if ((_value !== null) && !this.validate(_value)) {
            throw Error(`validation error. in FmAttr constructor. fmKey is ${fmKey}`);
        }

    }

    get value(): TValue | null {
        return this._value;
    }

    get newValue(): TValue | undefined {
        return this._newValue;
    }

    abstract setStore(store: StoreApi<TNoteState>): void;
    abstract getView(options?: any): ReactNode;
    abstract getEditableView(): ReactNode;
    getForcedEditableView(): ReactNode {
        return null;
    }

    abstract validate(value: TValue): boolean;
    abstract filter(value: TValue): TValue | null;

    abstract setNewValue(newValue: TValue): this;
    protected _setNewValueShallow(newValue: TValue): this {
        if (this.isImmutable) throw new Error("can not update.");
        this._newValue = newValue;
        return this;
    }

    async commitNewValue(): Promise<void> {
        if (this.isImmutable) throw new Error("to update is not allowed.");
        if (this._newValue === undefined) return;

        const filteredValue = this.filter(this._newValue);
        if (filteredValue === null) {
            throw new Error(`validation error in commit. fmKey: ${this.fmKey}`);
        }
        if (this._value == filteredValue) return;

        if (!this.validate(filteredValue)) {
            throw new Error(`validation error in commit. fmKey: ${this.fmKey}`);
        }

        await AM.repository.noteR.updateFmAttr(this.tFile, this.fmKey, filteredValue);
        this._value = structuredClone(this._newValue) || null;
        this.afterCommit();
    }

    async forcedUpdate(value: TValue) {
        const filteredValue = this.filter(value);
        if (filteredValue === null) {
            throw new Error(`validation error in commit. fmKey: ${this.fmKey}`);
        }
        if (this._value == filteredValue) return;
        if (!this.validate(filteredValue)) {
            throw new Error(`validation error in commit. fmKey: ${this.fmKey}`);
        }
        await AM.repository.noteR.updateFmAttr(this.tFile, this.fmKey, filteredValue);
        this._value = structuredClone(filteredValue) || null;

        this._newValue = filteredValue; // TODO: とりあえず。store更新の都合でこう、、、、
        this.afterCommit();
    }

    addListener(listener: Listener<TValue>): void {
        this._listeners.add(listener);
    }
    removeListener(listener: Listener<TValue>): void {
        this._listeners.delete(listener);
    }
    notify(): void {
        this._listeners.forEach(listen => {
            listen(this._value);
        });
    }

    protected afterCommit() {
        if (this._newValue) {
            this._storeSetter?.(this._newValue);
        }
        this._newValue = undefined;
        this.notify();
        this._caches = {};
    }
}