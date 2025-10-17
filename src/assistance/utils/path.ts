import { AM } from "src/app/AppManager";
import { LogNoteType, MyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { dateFormat, getCurrentYearMonth } from "./date";

export function getBasenameFromPath(path: string): string {
    const segments = path.split("/");
    const filename = segments.pop() || "";
    return filename.replace(/\.[^/.]+$/, ""); // 拡張子を除去
}

export function createMyNotePath(baseName: string, subType: MyNoteType): string {
    return `${AM.orbiz.rootPath}/galaxies/${subType}/${getCurrentYearMonth()}/${baseName}.md`;
    // return `${OAM().rootPath}/galaxies/${subType}/${getCurrentYearMonth()}/${baseName}.md`;
}

export function createLogNotePath(baseName: string, subType: LogNoteType): string {
    return `${AM.orbiz.rootPath}/logs/${subType}/${getCurrentYearMonth()}/${baseName}.md`;
    // return `${OAM().rootPath}/logs/${subType}/${getCurrentYearMonth()}/${baseName}.md`;
}

export function createDailyNotePath(date?: Date): string {
    const y = date ? dateFormat(date, "Y") : AM.diary.getToday("Y");
    // const y = date ? dateFormat(date, "Y") : AM.diary.getToday("Y");
    const m = date ? dateFormat(date, "m") : AM.diary.getToday("m");
    const ymd = date ? dateFormat(date, "Y-m-d") : AM.diary.getToday("Y-m-d");
    return `${AM.orbiz.rootPath}/diaries/daily/${y}/${m}/${ymd}.md`;
    // return `${OAM().rootPath}/diaries/daily/${y}/${m}/${ymd}.md`;
}

export function getParentPath(path: string): string {
    const parts = path.split("/").filter(part => part.length > 0);
    parts.pop(); // 最後の要素（ファイル名 or フォルダ名）を削除
    return parts.join("/");
}

