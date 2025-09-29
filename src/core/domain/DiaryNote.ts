import { DiaryFm } from "src/orbits/schema/frontmatters/fm";
import { BaseNote } from "./Note";

export abstract class DiaryNote<TFm extends DiaryFm = DiaryFm> extends BaseNote<TFm> {
    constructor(
        fm: TFm,
        readonly path: string
    ) {
        super(fm);
    }
}
export function isDiaryNote(note: any): note is DiaryNote {
    return note instanceof DiaryNote;
}