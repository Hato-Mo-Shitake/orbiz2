import { TFile } from "obsidian";
import { ReactNode } from "react";
import { StdNote } from "src/core/domain/StdNote";
import { FmLinkedNoteEditBox } from "src/looks/components/fm-edit/sub/FmLinkedNoteEditBox";
import { FmKey } from "src/orbits/contracts/fmKey";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { ORM } from "src/orbiz/managers/OrbizRepositoryManager";
import { FmAttr } from "./FmAttr";

type RawFmValueForLinkedNote = "noteId" | "internalLink";
export abstract class FmAttrLinkedNote extends FmAttr<StdNote | null> {
    constructor(
        tFile: TFile,
        fmKey: FmKey<"linkedNote">,
        rawFmValue: string | null | undefined, // 内部リンク or noteId
        protected readonly _rawFmValueType: RawFmValueForLinkedNote,
        options?: {
            isImmutable?: boolean,
        }
    ) {
        let note: StdNote | null;

        if (!rawFmValue) {
            note = null;
        } else if (_rawFmValueType === "internalLink") {
            note = ONM().getStdNote({ internalLink: rawFmValue });
        } else if (_rawFmValueType === "noteId") {
            note = ONM().getStdNote({ noteId: rawFmValue });
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

    validate(value: StdNote): boolean {
        return true;
    }

    filter(value: StdNote): StdNote {
        return value;
    }

    setNewValue(newValue: StdNote): this {
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

    getLooks(): ReactNode {
        return <div>{this.fmKey}: {this.value?.internalLink || ""}</div>;
    }

    getEditBox(): ReactNode {
        return <FmLinkedNoteEditBox
            fmAttr={this}
        />
    }
}

export class FmAttrRoleHub extends FmAttrLinkedNote {
    constructor(
        tFile: TFile,
        _value: string | null | undefined,
    ) {
        super(
            tFile,
            "roleHub",
            _value,
            "internalLink",
        )
    }
}