import { TFile } from "obsidian";
import { ReactNode } from "react";
import { isMyNote, MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { FmAttrRoleHubEditor } from "src/looks/components/note-metadata-edit/my/FmAttrRoleHubEditor";
import { FmAttrRoleHubDisplay } from "src/looks/components/note-metadata-view/my/FmAttrRoleHubDisplay";
import { FmKey } from "src/orbits/contracts/fmKey";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { ORM } from "src/orbiz/managers/OrbizRepositoryManager";
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
            note = ONM().getStdNote({ internalLink: rawFmValue });
            if (!isNote(note)) {
                OEM.throwUnexpectedError();
            }
        } else if (_rawFmValueType === "noteId") {
            note = ONM().getStdNote({ noteId: rawFmValue });
            if (!isNote(note)) {
                OEM.throwUnexpectedError();
            }
        } else {
            OEM.throwUnexpectedError();
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
            await ORM().noteR.updateFmAttr(this.tFile, this.fmKey, this._newValue.internalLink);
        } else if (this._rawFmValueType === "noteId") {
            await ORM().noteR.updateFmAttr(this.tFile, this.fmKey, this._newValue.id);
        } else {
            OEM.throwNotImplementedError();
        }

        this.afterCommit();
    }

    // getLooks(): ReactNode {
    //     return <div>{this.fmKey}: {this.value?.internalLink || ""}</div>;
    // }

    // getEditBox(): ReactNode {
    //     return <FmLinkedNoteEditBox
    //         fmAttr={this}
    //     />
    // }
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

    getView(options?: { header?: string }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrRoleHubDisplay
                store={this._store}
                header={options?.header}
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