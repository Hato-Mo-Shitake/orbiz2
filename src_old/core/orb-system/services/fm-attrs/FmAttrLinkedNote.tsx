import { TFile } from "obsidian";
import { ReactNode } from "react";
import { AM } from "src/app/AppManager";
import { isMyNote, MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { NotImplementedError } from "src/errors/NotImplementedError";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { FmAttrRoleHubEditor } from "src/looks/components/note-metadata-edit/my/FmAttrRoleHubEditor";
import { FmAttrRoleHubDisplay } from "src/looks/components/note-metadata-view/my/FmAttrRoleHubDisplay";
import { FmKey } from "src/orbits/contracts/fmKey";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { FmAttr } from "./FmAttr";

type RawFmValueForLinkedNote = "noteId" | "internalLink";
export abstract class FmAttrLinkedNote<TNote extends StdNote = StdNote> extends FmAttr<TNote | null> {
    constructor(
        tFile: TFile,
        fmKey: FmKey<"linkedNote">,
        rawFmValue: string | null | undefined, // 内部リンク or noteId
        protected readonly _rawFmValueType: RawFmValueForLinkedNote,
        isNote: (note: any) => note is TNote,
        options?: {
            isImmutable?: boolean,
        }
    ) {
        let note: StdNote | null;

        if (!rawFmValue) {
            note = null;
        } else if (_rawFmValueType === "internalLink") {
            note = AM.note.getStdNote({ internalLink: rawFmValue });
            if (!isNote(note)) {
                throw new UnexpectedError();
            }
        } else if (_rawFmValueType === "noteId") {
            note = AM.note.getStdNote({ noteId: rawFmValue });
            if (!isNote(note)) {
                throw new UnexpectedError();
            }
        } else {
            throw new UnexpectedError();
        }


        super(
            tFile,
            fmKey,
            options?.isImmutable || false,
            note
        );
    }

    validate(value: TNote): boolean {
        return true;
    }

    filter(value: TNote): TNote {
        return value;
    }

    setNewValue(newValue: TNote): this {
        if (this.isImmutable) throw new Error("can not update.");
        if (this.value === newValue) return this;

        this._newValue = newValue;

        return this;
    }

    async commitNewValue(): Promise<void> {
        if (this.isImmutable) throw new Error("to update is not allowed.");
        if (!this._newValue) return;
        if (this._value?.id === this._newValue.id) return;

        if (this._rawFmValueType === "internalLink") {
            await AM.repository.noteR.updateFmAttr(this.tFile, this.fmKey, this._newValue.internalLink);
        } else if (this._rawFmValueType === "noteId") {
            await AM.repository.noteR.updateFmAttr(this.tFile, this.fmKey, this._newValue.id);
        } else {
            throw new NotImplementedError();
        }

        this.afterCommit();
    }
}

export class FmAttrRoleHub extends FmAttrLinkedNote<MyNote> {
    protected _store: StoreApi<MyNoteState> | null;
    constructor(
        tFile: TFile,
        _value: string | null | undefined,
    ) {
        super(
            tFile,
            "roleHub",
            _value,
            "internalLink",
            isMyNote,
            {
                isImmutable: true,
            }
        )
    }

    setStore(store: StoreApi<MyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrRoleHub;
        this._storeSetter = (value: MyNote) => state.setFmAttrRoleHub(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrRoleHubDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrRoleHubEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }
}