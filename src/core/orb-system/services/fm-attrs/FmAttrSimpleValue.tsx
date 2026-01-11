import { TFile } from "obsidian";
import { FmKey } from "src/orbits/contracts/fmKey";
import { FmAttr } from "./FmAttr";

export abstract class FmAttrSimpleValue<TValue extends string | number | boolean> extends FmAttr<TValue> {
    constructor(
        tFile: TFile,
        fmKey: FmKey,
        _value: TValue,
        options?: {
            isImmutable?: boolean,
        }
    ) {
        super(
            tFile,
            fmKey,
            options?.isImmutable || false,
            _value
        )
    }

    get value(): TValue | null {
        return this._value;
    }
    get newValue(): TValue | undefined {
        return this._newValue;
    }

    validate(value: TValue): boolean {
        return true;
    }
    filter(value: TValue): TValue {
        return value;
    }

    setNewValue(newValue: TValue): this {
        return super._setNewValueShallow(newValue);
    }
}