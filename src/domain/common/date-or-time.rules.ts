import { DateTime } from "./DateTime.vo";

export type RawYMD = {
    y: number,
    m: number,
    d: number
}

export type DateFormat = "yyyy-mm-dd" | "yyyymmdd";
export type DateTimeFormat = DateFormat | "YYYY-MM-DDTHH:mm:ss";

export type TimeZone = "UTC" | "LOCAL";

export type DateTimeTermValue = {
    start: DateTime;
    end: DateTime;
}