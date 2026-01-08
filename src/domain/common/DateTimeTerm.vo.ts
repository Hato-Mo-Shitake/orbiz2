import { DateTimeTermValue } from "./date-or-time.rules";
import { DateTime } from "./DateTime.vo";
import { ValueObject } from "./ValueObject.vo";

const _brand = "DateTimeTerm";


export class DateTimeTerm extends ValueObject<DateTimeTermValue> {
    constructor(value: DateTimeTermValue) {
        if (value.end.isBefore(value.start)) {
            throw new Error("Invalid DateTimeTerm: end must not be before start.");
        }
        super(value, _brand);
    }

    getStart(): DateTime {
        return this._value.start;
    }

    getEnd(): DateTime {
        return this._value.end;
    }
    /** 指定日時が開始前か */
    isBeforeStart(dt: DateTime): boolean {
        return dt.isBefore(this.getStart());
    }

    /** 指定日時が終了後か */
    isAfterEnd(dt: DateTime): boolean {
        return dt.isAfter(this.getEnd());
    }

    /** 範囲内か */
    contains(dt: DateTime): boolean {
        return !this.isBeforeStart(dt) && !this.isAfterEnd(dt);
    }

    /** 他の期間と衝突しているか */
    overlaps(other: DateTimeTerm): boolean {
        return !this._value.end.isBefore(other.getStart()) && !this._value.start.isAfter(other.getEnd());
    }

    toString(): string {
        return `[${this._value.start.toString()}, ${this._value.end.toString()}]`;
    }
}