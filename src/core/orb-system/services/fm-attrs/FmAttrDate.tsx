import { TFile } from "obsidian";
import { ReactNode } from "react";
import { dateFormat } from "src/assistance/utils/date";
import { isValidDate } from "src/assistance/utils/validation";
import { FmDateEditBox } from "src/looks/components/fm-edit/sub/FmDateEditBoc";
import { FmKey } from "src/orbits/contracts/fmKey";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { ORM } from "src/orbiz/managers/OrbizRepositoryManager";
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

        await ORM().noteR.updateFmAttr(this.tFile, this.fmKey, newTimestamp);
        this._value = newTimestamp ? new Date(newTimestamp) : null;
        this.afterCommit();
    }

    getLooks(): ReactNode {
        return <div>{this.fmKey}: {this.value ? dateFormat(this.value, "Y-m-d_H:i_D") : ""}</div>;
    }

    getEditBox(): ReactNode {
        return <FmDateEditBox
            fmEditor={this}
        />
    }
}

export class FmAttrDue extends FmAttrDate {
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
}

export class FmAttrResolved extends FmAttrDate {
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

    protected afterCommit(): void {
        super.afterCommit();
        const id = ONM().getNoteIdByTFile(this.tFile);
        if (!id) OEM.throwUnexpectedError();
        ODM().todayRecordNoteIds.rIds.add(id);
    }
}

export class FmAttrTheDay extends FmAttrDate {
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
}
