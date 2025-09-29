import { LogNoteType, MyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { dateFormat, getCurrentYearMonth } from "./date";

export function getBasenameFromPath(path: string): string {
    const segments = path.split("/");
    const filename = segments.pop() || "";
    return filename.replace(/\.[^/.]+$/, ""); // 拡張子を除去
}

export function createMyNotePath(baseName: string, subType: MyNoteType): string {
    return `${OAM().rootPath}/galaxies/${subType}/${getCurrentYearMonth()}/${baseName}.md`;
}

export function createLogNotePath(baseName: string, subType: LogNoteType): string {
    return `${OAM().rootPath}/logs/${subType}/${getCurrentYearMonth()}/${baseName}.md`;
}

export function createDailyNotePath(date?: Date): string {
    const y = date ? dateFormat(date, "Y") : ODM().getToday("Y");
    const m = date ? dateFormat(date, "m") : ODM().getToday("m");
    const ymd = date ? dateFormat(date, "Y-m-d") : ODM().getToday("Y-m-d");
    return `${OAM().rootPath}/diaries/daily/${y}/${m}/${ymd}.md`;
}

export function getParentPath(path: string): string {
    const parts = path.split("/").filter(part => part.length > 0);
    parts.pop(); // 最後の要素（ファイル名 or フォルダ名）を削除
    return parts.join("/");
}

