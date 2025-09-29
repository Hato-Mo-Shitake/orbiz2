import { TFile } from "obsidian";
import { ReactNode } from "react";
import { FmBoolEditBox } from "src/looks/components/fm-edit/sub/FmBoolEditBox";
import { FmAttrSimpleValue } from "./FmAttrSimpleValue";

export abstract class FmAttrBoolean<TValue extends boolean = boolean> extends FmAttrSimpleValue<TValue> {
    getEditBox(): ReactNode {
        return <FmBoolEditBox
            fmEditor={this}
        />
    }
}

export class FmAttrIsClosed extends FmAttrBoolean {
    constructor(
        public readonly tFile: TFile,
        _value: boolean | null | undefined,
        options?: {
        }
    ) {
        super(
            tFile,
            "isClosed",
            _value || false,
            {
            }
        )
    }
}