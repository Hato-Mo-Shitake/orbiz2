import { TFile } from "obsidian";
import { ReactNode } from "react";
import { AM } from "src/app/AppManager";
import { isValidDate } from "src/assistance/utils/validation";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { FmAttrTheDayEditor } from "src/looks/components/note-metadata-edit/daily/FmAttrTheDayEditor";
import { FmAttrDueEditor } from "src/looks/components/note-metadata-edit/log/FmAttrDueEditor";
import { FmAttrResolvedEditor } from "src/looks/components/note-metadata-edit/log/FmAttrResolvedEditor";
import { FmAttrDoneEditor } from "src/looks/components/note-metadata-edit/my/FmAttrDoneEditor";
import { FmAttrTheDayDisplay } from "src/looks/components/note-metadata-view/daily/FmAttrTheDayDisplay";
import { FmAttrDueDisplay } from "src/looks/components/note-metadata-view/log/FmAttrDueDisplay";
import { FmAttrResolvedDisplay } from "src/looks/components/note-metadata-view/log/FmAttrResolvedDisplay";
import { FmAttrDoneDisplay } from "src/looks/components/note-metadata-view/my/FmAttrDoneDisplay";
import { FmKey } from "src/orbits/contracts/fmKey";
import { DailyNoteState, LogNoteState, MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { FmAttr } from "./FmAttr";

abstract class FmAttrDate extends FmAttr<Date | null> {
    constructor(
        tFile: TFile,
        fmKey: FmKey<"date">,
        readonly timestamp: number | null | undefined,
        options?: {
            isImmutable?: boolean,
        }
    ) {
        let date: Date | null;
        if (!timestamp) {
            date = null;
        } else {
            date = new Date(timestamp);
        }
        super(
            tFile,
            fmKey,
            options?.isImmutable || false,
            date
        );
    }

    validate(value: Date | null): boolean {
        if (value === null) return true;
        return isValidDate(value);
    }

    filter(value: Date | null): Date | null {
        return value;
    }

    setNewValue(newValue: Date): this {
        if (this.isImmutable) throw new Error("can not update.");
        if (this.value?.getTime() === newValue.getTime()) return this;

        this._newValue = new Date(newValue.getTime());

        return this;
    }

    async commitNewValue(): Promise<void> {
        if (this.isImmutable) throw new Error("to update is not allowed.");
        if (this._newValue === undefined) return;
        const newTimestamp = this._newValue?.getTime();
        if (this._value?.getTime() === newTimestamp) return;

        await AM.repository.noteR.updateFmAttr(this.tFile, this.fmKey, newTimestamp);
        this._value = newTimestamp ? new Date(newTimestamp) : null;
        this.afterCommit();
    }
}

export class FmAttrDone extends FmAttrDate {
    protected _store: StoreApi<MyNoteState> | null;
    constructor(
        tFile: TFile,
        timestamp: number | null | undefined,
    ) {
        super(
            tFile,
            "done",
            timestamp,
        );
    }

    setStore(store: StoreApi<MyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrDone;
        this._storeSetter = (value: Date) => state.setFmAttrDone(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrDoneDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrDoneEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }

    protected afterCommit(): void {
        super.afterCommit();
        const id = AM.note.getNoteIdByTFile(this.tFile);
        if (!id) throw new UnexpectedError();
        AM.diary.addDailyLogNoteIds("doneNotes", id);
    }
}

export class FmAttrDue extends FmAttrDate {
    protected _store: StoreApi<LogNoteState> | null;
    constructor(
        tFile: TFile,
        timestamp: number | null | undefined,
    ) {
        super(
            tFile,
            "due",
            timestamp,
        );
    }

    setStore(store: StoreApi<LogNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrDue;
        this._storeSetter = (value: Date) => state.setFmAttrDue(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrDueDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrDueEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }
}

export class FmAttrResolved extends FmAttrDate {
    protected _store: StoreApi<LogNoteState> | null;
    constructor(
        tFile: TFile,
        timestamp: number | null | undefined,
    ) {
        super(
            tFile,
            "resolved",
            timestamp,
            {
                isImmutable: Boolean(timestamp)
            }
        );
    }

    setStore(store: StoreApi<LogNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrResolved;
        this._storeSetter = (value: Date) => state.setFmAttrResolved(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrResolvedDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrResolvedEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }

    protected afterCommit(): void {
        super.afterCommit();
        const id = AM.note.getNoteIdByTFile(this.tFile);
        if (!id) throw new UnexpectedError();
        AM.diary.addDailyLogNoteIds("resolvedNotes", id);
    }
}

export class FmAttrTheDay extends FmAttrDate {
    protected _store: StoreApi<DailyNoteState> | null;
    constructor(
        tFile: TFile,
        timestamp: number | null | undefined,
    ) {
        super(
            tFile,
            "theDay",
            timestamp,
        );
    }

    get value(): Date {
        if (!this._value) {
            throw new UnexpectedError();
        }
        return this._value;
    }

    setStore(store: StoreApi<DailyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrTheDay;
        this._storeSetter = (value: Date) => state.setFmAttrTheDay(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrTheDayDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrTheDayEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }
}
