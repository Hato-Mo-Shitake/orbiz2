import { TFile } from "obsidian";
import { ReactNode } from "react";
import { FmNumberEditBox } from "src/looks/components/fm-edit/sub/FmNumberEditBox";
import { FmAttrSimpleValue } from "./FmAttrSimpleValue";

export abstract class FmAttrNumber<TValue extends number = number> extends FmAttrSimpleValue<TValue> {
    getEditBox(): ReactNode {
        return <FmNumberEditBox
            fmEditor={this}
        />
    }
}

export class FmAttrRank extends FmAttrNumber {
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
}

export class FmAttrScore extends FmAttrNumber {
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
}

export class FmAttrAmountSpent extends FmAttrNumber {
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
}