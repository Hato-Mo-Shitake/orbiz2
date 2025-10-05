import { TFile } from "obsidian";
import { ReactNode } from "react";
import { arraysEqual } from "src/assistance/utils/array";
import { StdNote } from "src/core/domain/StdNote";
import { FmAttrDailyLinkedNoteListEditor } from "src/looks/components/note-metadata-edit/daily/FmAttrDailyLinkedNoteListEditor";
import { FmAttrLinkedNoteListEditor } from "src/looks/components/note-metadata-edit/std/FmAttrLinkedNoteListEditor";
import { FmAttrDailyLinkedNoteListDisplay } from "src/looks/components/note-metadata-view/daily/FmAttrDailyLinkedNoteListDisplay";
import { FmAttrLinkedNoteListDisplay } from "src/looks/components/note-metadata-view/std/FmAttrLinkedNoteListDisplay";
import { FmAttrList } from "src/orbits/contracts/fmAttr";
import { FmKey } from "src/orbits/contracts/fmKey";
import { DailyNoteState, StdNoteState } from "src/orbits/schema/NoteState";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { ORM } from "src/orbiz/managers/OrbizRepositoryManager";
import { StoreApi } from "zustand";
import { FmAttr } from "./FmAttr";

type RawFmValueForLinkedNote = "noteId" | "internalLink";
export abstract class FmAttrLinkedNoteList extends FmAttr<StdNote[]> implements FmAttrList<StdNote> {

    // protected _store: StoreApi<StdNoteState> | null;
    constructor(
        tFile: TFile,
        fmKey: FmKey<"linkedNoteList">,
        rawFmValueList: string[] | null | undefined, // 内部リンク or noteId。両方が混ざることは考慮しない。
        protected readonly _rawFmValueType: RawFmValueForLinkedNote,
        options?: {
            isImmutable?: boolean,
        }
    ) {
        let noteList: StdNote[];

        if (!rawFmValueList) {
            noteList = [];
        } else if (_rawFmValueType === "internalLink") {
            noteList = rawFmValueList.reduce((pre: StdNote[], rawFmValue: string) => {
                const note = ONM().getStdNote({ internalLink: rawFmValue });
                if (!note) return pre;
                return [...pre, note];
            }, []);
        } else if (_rawFmValueType === "noteId") {
            noteList = rawFmValueList.reduce((pre: StdNote[], rawFmValue: string) => {
                const note = ONM().getStdNote({ noteId: rawFmValue });
                if (!note) return pre;
                return [...pre, note];
            }, []);
        } else {
            OEM.throwUnexpectedError();
        }

        super(
            tFile,
            fmKey,
            options?.isImmutable || false,
            noteList,
        );
    }

    get value(): StdNote[] {
        // if (this._storeGetter) {
        //     return this._storeGetter() || [];
        // }
        return this._value || [];
    }

    addNewAVal(aVal: StdNote): this {
        if (this.isImmutable) throw new Error("can not update.");

        if (this._newValue === undefined) {
            this._newValue = [...this.value];
        }

        this._newValue.push(aVal);
        return this;
    }
    mergeNewValue(newValue: StdNote[]): this {
        if (this.isImmutable) throw new Error("can not update.");

        if (this._newValue === undefined) {
            this._newValue = [...this.value];
        }

        const currentIds = this._newValue?.map(aVal => aVal.id);
        const filtered = newValue.filter(aVal => !currentIds.includes(aVal.id));

        this._newValue = [...filtered, ...this._newValue];
        return this;
    }
    // TODO: deleteNewAValあった方がいい？
    setNewValue(newValue: StdNote[]): this {

        if (this.isImmutable) throw new Error("can not update.");
        if (
            newValue === this._value
            || newValue === this._newValue
        ) return this;

        this._newValue = [...newValue];
        return this;
    }

    validateAVal(aVal: StdNote): boolean {
        return true;
    }
    validate(value: StdNote[]): boolean {
        for (const aVal of value) {
            if (!this.validateAVal(aVal)) return false;
        }
        return true;
    }
    filterAVal(aVal: StdNote): StdNote {
        return aVal;
    }
    filter(value: StdNote[]): StdNote[] {
        return value.map(this.filterAVal);
    }

    async commitNewValue(): Promise<void> {
        if (this.isImmutable) throw new Error("to update is not allowed.");
        if (!this._newValue) return;
        if (this.value === this._newValue) return;
        if (arraysEqual(this.value.map(aVal => aVal.id), this._newValue.map(aVal => aVal.id))) return;

        if (this._rawFmValueType === "internalLink") {
            await ORM().noteR.updateFmAttr(this.tFile, this.fmKey, this._newValue.map(aVal => aVal.internalLink));
        } else if (this._rawFmValueType === "noteId") {
            await ORM().noteR.updateFmAttr(this.tFile, this.fmKey, this._newValue.map(aVal => aVal.id));
        } else {
            OEM.throwNotImplementedError();
        }

        this._value = this.newValue ? [...this.newValue] : [];
        this.afterCommit();
    }

    get noteIds(): string[] {
        return this.value.map(note => note.id);
    }

    // getEditBox(): ReactNode {
    //     return <FmLinkedNoteListEditBox
    //         fmAttr={this}
    //     />
    // }
}

export class FmAttrBelongsTo extends FmAttrLinkedNoteList {
    protected _store: StoreApi<StdNoteState> | null;
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "belongsTo",
            _value || [],
            "internalLink"
        )
    }

    setStore(store: StoreApi<StdNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrBelongsTo;
        this._storeSetter = (value: StdNote[]) => state.setFmAttrBelongsTo(value);
        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrLinkedNoteListDisplay
                store={this._store}
                selector={(state) => state.fmAttrBelongsTo}
                header={this.fmKey}
            />
        </>)
    }

    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrLinkedNoteListEditor
                store={this._store}
                selector={(s) => s.fmAttrBelongsTo}
                fmAttr={this}
            />
        </>)
    }
}

export class FmAttrRelatesTo extends FmAttrLinkedNoteList {
    protected _store: StoreApi<StdNoteState> | null;
    constructor(
        tFile: TFile,
        _value: string[] | undefined | null,
    ) {
        super(
            tFile,
            "relatesTo",
            _value || [],
            "internalLink"
        )
    }

    setStore(store: StoreApi<StdNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrRelatesTo;
        this._storeSetter = (value: StdNote[]) => state.setFmAttrRelatesTo(value);
        this._storeSetter(this.value);
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrLinkedNoteListDisplay
                store={this._store}
                selector={(state) => state.fmAttrRelatesTo}
                header={this.fmKey}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrLinkedNoteListEditor
                store={this._store}
                selector={(s) => s.fmAttrRelatesTo}
                fmAttr={this}
            />
        </>)
    }
}

export class FmAttrReferences extends FmAttrLinkedNoteList {
    protected _store: StoreApi<StdNoteState> | null;
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "references",
            _value || [],
            "internalLink"
        )
    }

    setStore(store: StoreApi<StdNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrReferences;
        this._storeSetter = (value: StdNote[]) => state.setFmAttrReferences(value);
        this._storeSetter(this.value);
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrLinkedNoteListDisplay
                store={this._store}
                selector={(state) => state.fmAttrReferences}
                header={this.fmKey}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrLinkedNoteListEditor
                store={this._store}
                selector={(s) => s.fmAttrReferences}
                fmAttr={this}
            />
        </>)
    }
}

export class FmAttrCreatedNotes extends FmAttrLinkedNoteList {
    protected _store: StoreApi<DailyNoteState> | null;
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "createdNotes",
            _value || [],
            "noteId"
        )
    }

    setStore(store: StoreApi<DailyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrCreatedNotes;
        this._storeSetter = (value: StdNote[]) => state.setFmAttrCreatedNotes(value);
        this._storeSetter(this.value);
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrDailyLinkedNoteListDisplay
                store={this._store}
                selector={(state) => state.fmAttrCreatedNotes}
                header={this.fmKey}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrDailyLinkedNoteListEditor
                store={this._store}
                selector={(s) => s.fmAttrCreatedNotes}
                fmAttr={this}
            />
        </>)
    }
}

export class FmAttrModifiedNotes extends FmAttrLinkedNoteList {
    protected _store: StoreApi<DailyNoteState> | null;
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "modifiedNotes",
            _value || [],
            "noteId"
        )
    }

    setStore(store: StoreApi<DailyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrModifiedNotes;
        this._storeSetter = (value: StdNote[]) => state.setFmAttrModifiedNotes(value);
        this._storeSetter(this.value);
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrDailyLinkedNoteListDisplay
                store={this._store}
                selector={(state) => state.fmAttrModifiedNotes}
                header={this.fmKey}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrDailyLinkedNoteListEditor
                store={this._store}
                selector={(s) => s.fmAttrModifiedNotes}
                fmAttr={this}
            />
        </>)
    }
}

export class FmAttrResolvedNotes extends FmAttrLinkedNoteList {
    protected _store: StoreApi<DailyNoteState> | null;
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "resolvedNotes",
            _value || [],
            "noteId"
        )
    }

    setStore(store: StoreApi<DailyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrResolvedNotes;
        this._storeSetter = (value: StdNote[]) => state.setFmAttrResolvedNotes(value);
        this._storeSetter(this.value);
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrDailyLinkedNoteListDisplay
                store={this._store}
                selector={(state) => state.fmAttrResolvedNotes}
                header={this.fmKey}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrDailyLinkedNoteListEditor
                store={this._store}
                selector={(s) => s.fmAttrResolvedNotes}
                fmAttr={this}
            />
        </>)
    }
}
