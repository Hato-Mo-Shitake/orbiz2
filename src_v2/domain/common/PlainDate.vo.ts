import { DateFormat, RawYMD } from "./date-or-time.rules";
import { ValueObject } from "./ValueObject.vo";

const _brand = "PlainDate";

function _validate(ymd: RawYMD): void {
    const [year, month, day] = [ymd.y, ymd.m, ymd.d];

    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
        throw new Error("Year, month, and day must be integers.");
    }
    if (month < 1 || month > 12) {
        throw new Error("Month must be between 1 and 12.");
    }
    if (day < 1 || day > 31) {
        throw new Error("Day must be between 1 and 31.");
    }

    // Dateのmonthは0から数える（0 = 1月）ので、これは翌月の0日 -> つまり当月の末日
    const maxDay = new Date(year, month, 0).getDate();
    if (day > maxDay) {
        throw new Error(`Invalid day for the given month: ${day}`);
    }
}

/**
 * m: 1~12
 */
export class PlainDate extends ValueObject<RawYMD> {
    constructor(ymd: RawYMD) {
        _validate(ymd);
        super(ymd, _brand);
    }

    getYear(): number {
        return this._value.y;
    }

    getMonth(): number {
        return this._value.m;
    }

    getDay(): number {
        return this._value.d;
    }

    equals(other: PlainDate): boolean {
        return (
            this.getYear() === other.getYear() &&
            this.getMonth() === other.getMonth() &&
            this.getDay() === other.getDay()
        );
    }

    isBefore(other: PlainDate): boolean {
        return (
            this.getYear() < other.getYear() ||
            (this.getYear() === other.getYear() && this.getMonth() < other.getMonth()) ||
            (this.getYear() === other.getYear() && this.getMonth() === other.getMonth() && this.getDay() < other.getDay())
        );
    }

    isAfter(other: PlainDate): boolean {
        return other.isBefore(this);
    }

    toString(format: DateFormat): string {
        const yyyy = this.getYear().toString().padStart(4, "0");
        const mm = this.getMonth().toString().padStart(2, "0");
        const dd = this.getDay().toString().padStart(2, "0");

        switch (format) {
            case "yyyy-mm-dd":
                return `${yyyy}-${mm}-${dd}`;
            case "yyyymmdd":
                return `${yyyy}${mm}${dd}`;
            default:
                return `${yyyy}-${mm}-${dd}`;
        }
    }

    toDate(): Date {
        return new Date(this.getYear(), this.getMonth() - 1, this.getDay());
    }
}