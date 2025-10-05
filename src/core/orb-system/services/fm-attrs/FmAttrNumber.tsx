import { TFile } from "obsidian";
import { ReactNode } from "react";
import { FmAttrAmountSpentEditor } from "src/looks/components/note-metadata-edit/daily/FmAttrAmountSpentEditor";
import { FmAttrScoreEditor } from "src/looks/components/note-metadata-edit/diary/FmAttrScoreEditor";
import { FmAttrRankEditor } from "src/looks/components/note-metadata-edit/my/FmAttrRankEditor";
import { FmAttrAmountSpentDisplay } from "src/looks/components/note-metadata-view/daily/FmAttrAmountSpentDisplay";
import { FmAttrScoreDisplay } from "src/looks/components/note-metadata-view/diary/FmAttrScoreDisplay";
import { FmAttrRankDisplay } from "src/looks/components/note-metadata-view/my/FmAttrRankDisplay";
import { DailyNoteState, DiaryNoteState, MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { FmAttrSimpleValue } from "./FmAttrSimpleValue";

export abstract class FmAttrNumber<TValue extends number = number> extends FmAttrSimpleValue<TValue> {
    // getEditBox(): ReactNode {
    //     return <FmNumberEditBox
    //         fmEditor={this}
    //     />
    // }
}

export class FmAttrRank extends FmAttrNumber {
    protected _store: StoreApi<MyNoteState> | null;
    constructor(
        tFile: TFile,
        _value: number | null | undefined,
    ) {
        super(
            tFile,
            "rank",
            _value || 0,
        )
    }

    setStore(store: StoreApi<MyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrRank;
        this._storeSetter = (value: number) => state.setFmAttrRank(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrRankDisplay
                store={this._store}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrRankEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }
}

export class FmAttrScore extends FmAttrNumber {
    protected _store: StoreApi<DiaryNoteState> | null;
    constructor(
        tFile: TFile,
        _value: number | null | undefined,
    ) {
        super(
            tFile,
            "score",
            _value || 0,
        )
    }

    setStore(store: StoreApi<DiaryNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrScore;
        this._storeSetter = (value: number) => state.setFmAttrScore(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrScoreDisplay
                store={this._store}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrScoreEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }
}

export class FmAttrAmountSpent extends FmAttrNumber {
    protected _store: StoreApi<DailyNoteState> | null;
    constructor(
        tFile: TFile,
        _value: number | null | undefined,
    ) {
        super(
            tFile,
            "amountSpent",
            _value || 0,
        )
    }

    setStore(store: StoreApi<DailyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrAmountSpent;
        this._storeSetter = (value: number) => state.setFmAttrAmountSpent(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrAmountSpentDisplay
                store={this._store}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrAmountSpentEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }
}