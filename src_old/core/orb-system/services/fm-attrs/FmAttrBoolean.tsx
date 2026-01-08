import { TFile } from "obsidian";
import { ReactNode } from "react";
import { FmAttrIsClosedEditor } from "src/looks/components/note-metadata-edit/diary/FmAttrIsClosedEditor";
import { FmAttrIsClosedDisplay } from "src/looks/components/note-metadata-view/diary/FmAttrIsClosedDisplay";
import { DiaryNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { FmAttrSimpleValue } from "./FmAttrSimpleValue";

export abstract class FmAttrBoolean<TValue extends boolean = boolean> extends FmAttrSimpleValue<TValue> {
}

export class FmAttrIsClosed extends FmAttrBoolean {
    protected _store: StoreApi<DiaryNoteState> | null;
    constructor(
        public readonly tFile: TFile,
        _value: boolean | null | undefined,
    ) {
        super(
            tFile,
            "isClosed",
            _value || false,
        )
    }

    setStore(store: StoreApi<DiaryNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrIsClosed;
        this._storeSetter = (value: boolean) => state.setFmAttrIsClosed(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrIsClosedDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrIsClosedEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }
}