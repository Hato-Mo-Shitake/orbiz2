import { TFile } from "obsidian";
import { ReactNode } from "react";
import { FmAttrIsClosedEditor } from "src/looks/components/note-metadata-edit/diary/FmAttrIsClosedEditor";
import { FmBoolEditBox } from "src/looks/components/note-metadata-edit/sub/FmBoolEditBox";
import { FmAttrIsClosedDisplay } from "src/looks/components/note-metadata-view/diary/FmAttrIsClosedDisplay";
import { DiaryNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { FmAttrSimpleValue } from "./FmAttrSimpleValue";

export abstract class FmAttrBoolean<TValue extends boolean = boolean> extends FmAttrSimpleValue<TValue> {
    getEditBox(): ReactNode {
        return <FmBoolEditBox
            fmEditor={this}
        />
    }
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

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrIsClosedDisplay
                store={this._store}
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