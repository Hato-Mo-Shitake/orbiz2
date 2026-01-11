import { DailyFm } from "src/orbits/schema/frontmatters/fm";
import { DiaryNote } from "./DiaryNote";

export class DailyNote<TFm extends DailyFm = DailyFm> extends DiaryNote<TFm> {
}
export function isDailyNote(note: any): note is DailyNote {
    return note instanceof DailyNote;
}