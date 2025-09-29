import { TFile } from "obsidian";
import { ReactNode } from "react";
import { FmAttrEditor, FmAttrViewer } from "src/orbits/contracts/fmAttr";
import { FmKey } from "src/orbits/contracts/fmKey";
import { Listener } from "src/orbits/contracts/observer";
import { ORM } from "src/orbiz/managers/OrbizRepositoryManager";

export abstract class FmAttr<TValue = any> implements FmAttrEditor<TValue>, FmAttrViewer<TValue> {
    protected _newValue: TValue | undefined = undefined;

    protected _listeners = new Set<Listener<TValue | null>>();
    protected _caches: Partial<Record<string, any>> = {};

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

        await ORM().noteR.updateFmAttr(this.tFile, this.fmKey, filteredValue);
        this._value = this._newValue || null;
        this.afterCommit();
    }

    getLooks(): ReactNode {
        // NOTE: 結局、メタデータの更新時は全部リロードすることにする。inLinksの感知が難しいため。
        return <div>{this.fmKey}: {String(this.value)}</div>;
    }
    abstract getEditBox(): ReactNode;

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
        // this._value = this._newValue || null;
        this._newValue = undefined;
        this.notify();
        this._caches = {};
    }
}