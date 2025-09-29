import { TFile } from "obsidian";
import { ReactNode } from "react";
import { arraysEqual } from "src/assistance/utils/array";
import { StdNote } from "src/core/domain/StdNote";
import { FmLinkedNoteListEditBox } from "src/looks/components/fm-edit/sub/FmLinkedNoteListEditBox";
import { FmAttrList } from "src/orbits/contracts/fmAttr";
import { FmKey } from "src/orbits/contracts/fmKey";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { ORM } from "src/orbiz/managers/OrbizRepositoryManager";
import { FmAttr } from "./FmAttr";

type RawFmValueForLinkedNote = "noteId" | "internalLink";
export abstract class FmAttrLinkedNoteList extends FmAttr<StdNote[]> implements FmAttrList<StdNote> {
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

    getEditBox(): ReactNode {
        return <FmLinkedNoteListEditBox
            fmAttr={this}
        />
    }
}

export class FmAttrBelongsTo extends FmAttrLinkedNoteList {
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
}

export class FmAttrRelatesTo extends FmAttrLinkedNoteList {
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
}

export class FmAttrReferences extends FmAttrLinkedNoteList {
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
}

export class FmAttrCreatedNoteIds extends FmAttrLinkedNoteList {
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "createdNoteIds",
            _value || [],
            "noteId"
        )
    }
}

export class FmAttrModifiedNoteIds extends FmAttrLinkedNoteList {
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "modifiedNoteIds",
            _value || [],
            "noteId"
        )
    }
}

export class FmAttrResolvedNoteIds extends FmAttrLinkedNoteList {
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "resolvedNoteIds",
            _value || [],
            "noteId"
        )
    }
}
