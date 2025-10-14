import { TFile } from "obsidian";
import { ReactNode } from "react";
import { arraysEqual } from "src/assistance/utils/array";
import { FmAttrTagsEditor } from "src/looks/components/note-metadata-edit/base/FmAttrTagsEditor";
import { FmAttrTemplateDoneEditor } from "src/looks/components/note-metadata-edit/daily/FmAttrTemplateDoneEditor";
import { FmAttrAliasesEditor } from "src/looks/components/note-metadata-edit/my/FmAttrAliasesEditor";
import { FmAttrCategoriesEditor } from "src/looks/components/note-metadata-edit/my/FmAttrCategoriesEditor";
import { FmAttrTagsDisplay } from "src/looks/components/note-metadata-view/base/FmAttrTagsDisplay";
import { FmAttrTemplateDoneDisplay } from "src/looks/components/note-metadata-view/daily/FmAttrTemplateDoneDisplay";
import { FmAttrAliasesDisplay } from "src/looks/components/note-metadata-view/my/FmAttrAliasesDisplay";
import { FmAttrCategoriesDisplay } from "src/looks/components/note-metadata-view/my/FmAttrCategoriesDisplay";
import { FmAttrList } from "src/orbits/contracts/fmAttr";
import { FmKey } from "src/orbits/contracts/fmKey";
import { BaseNoteState, DailyNoteState, MyNoteState } from "src/orbits/schema/NoteState";
import { ORM } from "src/orbiz/managers/OrbizRepositoryManager";
import { OSM } from "src/orbiz/managers/OrbizSettingManager";
import { StoreApi } from "zustand";
import { FmAttr } from "./FmAttr";

export abstract class FmAttrStringList<TAVal extends string = string> extends FmAttr<TAVal[]> implements FmAttrList<TAVal> {
    constructor(
        tFile: TFile,
        fmKey: FmKey,
        _value: TAVal[],
        options?: {
            isImmutable?: boolean,
        }
    ) {
        super(
            tFile,
            fmKey,
            options?.isImmutable || false,
            _value
        );
    }

    get value(): TAVal[] {
        // if (this._storeGetter) {
        //     return this._storeGetter() || [];
        // }
        return this._value || [];
    }

    addNewAVal(aVal: TAVal): this {
        if (this._newValue === undefined) {
            this._newValue = [...this.value];
        }

        this._newValue.push(aVal);
        return this;
    }
    // TODO: deleteNewAValあった方がいい？
    setNewValue(newValue: TAVal[]): this {
        if (this.isImmutable) throw new Error("can not update.");
        if (
            newValue === this._value
            || newValue === this._newValue
        ) return this;

        this._newValue = [...newValue];
        return this;
    }

    validateAVal(aVal: TAVal): boolean {
        return true;
    }
    validate(value: TAVal[]): boolean {
        for (const aVal of value) {
            if (!this.validateAVal(aVal)) return false;
        }
        return true;
    }

    filterAVal(aVal: TAVal): TAVal {
        return aVal;
    }
    filter(value: TAVal[]): TAVal[] {
        return value.map(this.filterAVal);
    }

    async commitNewValue(): Promise<void> {
        if (this.isImmutable) throw new Error("to update is not allowed.");
        if (!this._newValue) return;
        if (this.value === this._newValue) return;
        if (arraysEqual(this.value, this._newValue)) return;

        ORM().noteR.updateFmAttr(this.tFile, this.fmKey, this._newValue);
        this._value = this.newValue ? [...this.newValue] : [];
        this.afterCommit();
    }

    // getEditBox(): ReactNode {
    //     return <FmStringListEditBox
    //         fmEditor={this}
    //     />
    // }
}

export class FmAttrTags extends FmAttrStringList {
    constructor(
        tFile: TFile,
        _value: string[] | undefined | null,
    ) {
        super(
            tFile,
            "tags",
            _value || [],
        );
    }

    setStore(store: StoreApi<BaseNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrTags;
        this._storeSetter = (value: string[]) => state.setFmAttrTags(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(options?: { header?: string, headerWidth?: number, isHorizon?: boolean }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrTagsDisplay
                store={this._store}
                header={options?.header}
                isHorizon={options?.isHorizon}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrTagsEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }

    // getLooks(): ReactNode {
    //     return (
    //         <div>
    //             <a onClick={() => {
    //                 TagSearchlightModal.open()
    //             }}>tags: </a>

    //             {String(this.value)}
    //         </div>
    //     );
    // }
}

export class FmAttrAliases extends FmAttrStringList {
    protected _store: StoreApi<MyNoteState> | null;
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "aliases",
            _value || [],
            {
            }
        );
    }

    setStore(store: StoreApi<MyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrAliases;
        this._storeSetter = (value: string[]) => state.setFmAttrAliases(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(options?: { header?: string, headerWidth: number, isHorizon?: boolean }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrAliasesDisplay
                store={this._store}
                header={options?.header}
                isHorizon={options?.isHorizon}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrAliasesEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }
}

export class FmAttrCategories extends FmAttrStringList {
    protected _store: StoreApi<MyNoteState> | null;
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "categories",
            _value || [],
        );
    }

    setStore(store: StoreApi<MyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrCategories;
        this._storeSetter = (value: string[]) => state.setFmAttrCategories(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    filterAVal(aVal: string): string {
        if (!OSM().categories.includes(aVal)) {
            return "";
        }
        return aVal;
    }

    validateAVal(aVal: string): boolean {
        return OSM().categories.includes(aVal) || aVal == "";
    }

    getView(options?: { header?: string, headerWidth?: number, isHorizon?: boolean }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrCategoriesDisplay
                store={this._store}
                header={options?.header}
                isHorizon={options?.isHorizon}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrCategoriesEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }

    // getLooks(): ReactNode {
    //     return (
    //         <div>
    //             <a onClick={() => {
    //                 CategorySearchlightModal.open()
    //             }}>categories: </a>

    //             {String(this.value)}
    //         </div>
    //     );
    // }

    // getEditBox(): ReactNode {
    //     return <FmAttrSelectableList
    //         fmEditor={this}
    //         selections={OSM().categories}
    //     />
    // }
}

export class FmAttrTemplateDone extends FmAttrStringList {
    protected _store: StoreApi<DailyNoteState> | null;
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "templateDone",
            _value || [],
        );
    }

    filterAVal(aVal: string): string {
        if (!OSM().templateDone.includes(aVal)) {
            return "";
        }
        return aVal;
    }

    validateAVal(aVal: string): boolean {
        return OSM().templateDone.includes(aVal) || aVal == "";
    }

    setStore(store: StoreApi<DailyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrTemplateDone;
        this._storeSetter = (value: string[]) => state.setFmAttrTemplateDone(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrTemplateDoneDisplay
                store={this._store}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrTemplateDoneEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }
}
