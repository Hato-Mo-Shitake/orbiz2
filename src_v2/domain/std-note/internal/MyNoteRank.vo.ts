import { ValueObject } from "../../common/ValueObject.vo";

const _brand = "MyNoteRank";

function _validate(value: number): void {
    if (typeof value !== "number" || isNaN(value) || !isFinite(value)) {
        throw new Error("Invalid MyNoteRank value: must be a finite number.");
    }

    if (!Number.isInteger(value)) {
        throw new Error("MyNoteRank must be an integer.");
    }
}

export class MyNoteRank extends ValueObject<number> {
    private constructor(value: number) {
        _validate(value);
        super(value, _brand);
    }

    static from(value: number): MyNoteRank {
        return new MyNoteRank(value);
    }

    isGreaterThan(other: MyNoteRank): boolean {
        return this._value > other._value;
    }

    isGreaterThanOrEqual(other: MyNoteRank): boolean {
        return this._value >= other._value;
    }

    isLessThan(other: MyNoteRank): boolean {
        return this._value < other._value;
    }

    isLessThanOrEqual(other: MyNoteRank): boolean {
        return this._value <= other._value;
    }
}