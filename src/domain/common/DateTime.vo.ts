import { DateTimeFormat, TimeZone } from "./date-or-time.rules";
import { PlainDate } from "./PlainDate.vo";
import { ValueObject } from "./ValueObject.vo";

const _brand = "DateTime";

export class DateTime extends ValueObject<Date> {
    /**
     * ミリ秒（milliseconds）
     * @param timestamp 
     */
    constructor(timestamp: number) {

        const date = new Date(timestamp);

        if (isNaN(date.getTime())) {
            throw new Error("Invalid timestamp for DateTime.");
        }

        super(date, _brand);
    }

    toDate(): Date {
        return new Date(this._value.getTime());
    }

    getTimestamp(): number {
        return this._value.getTime();
    }

    equals(other: DateTime): boolean {
        return this._value.getTime() === other._value.getTime();
    }

    isBefore(other: DateTime): boolean {
        return this._value.getTime() < other._value.getTime();
    }

    isAfter(other: DateTime): boolean {
        return this._value.getTime() > other._value.getTime();
    }

    toString(options?: { format?: DateTimeFormat; timezone?: TimeZone }): string {
        const { format = "YYYY-MM-DDTHH:mm:ss", timezone = "LOCAL" } = options || {};
        const date = this._value;

        const isLocal = timezone === "LOCAL";

        const y = isLocal ? date.getFullYear() : date.getUTCFullYear();
        const m = (isLocal ? date.getMonth() : date.getUTCMonth()) + 1;
        const d = isLocal ? date.getDate() : date.getUTCDate();

        const yyyy = String(y).padStart(4, "0");
        const mm = String(m).padStart(2, "0");
        const dd = String(d).padStart(2, "0");

        if (format === "yyyy-mm-dd") {
            return `${yyyy}-${mm}-${dd}`;
        }

        if (format === "yyyymmdd") {
            return `${yyyy}${mm}${dd}`;
        }

        const hour = isLocal ? date.getHours() : date.getUTCHours();
        const min = isLocal ? date.getMinutes() : date.getUTCMinutes();
        const sec = isLocal ? date.getSeconds() : date.getUTCSeconds();

        const hh = String(hour).padStart(2, "0");
        const mmForMin = String(min).padStart(2, "0");
        const ss = String(sec).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}T${hh}:${mmForMin}:${ss}`;
    }

    toISOString(): string {
        return this._value.toISOString();
    }

    toPlainDate(): PlainDate {
        return new PlainDate({
            y: this._value.getFullYear(),
            m: this._value.getMonth() + 1,
            d: this._value.getDate()
        });
    }
}