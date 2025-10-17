import { TFolder } from "obsidian";
import { AM } from "src/app/AppManager";
import { dateFormat } from "src/assistance/utils/date";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { recordValues } from "src/assistance/utils/record";
import { DailyNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { NotInitializedError } from "src/errors/NotInitializedError";
import { UnexpectedError } from "src/errors/UnexpectedError";

export class DiaryManager {
    private static _instance: DiaryManager | null = null;

    static setInstance(
    ): void {
        this._instance = new DiaryManager();
    }

    static getInstance(): DiaryManager {
        if (!this._instance) throw new NotInitializedError();

        return this._instance;
    }

    /** ------------ */

    readonly todayRecordNoteIds = {
        cIds: new Set<string>(),
        mIds: new Set<string>(),
        rIds: new Set<string>()
    }
    private constructor(

    ) {
        this._today = new Date();
    }

    private _todayNoteOrb: DailyNoteOrb | undefined;
    async initialize() {
        let todayOrb: DailyNoteOrb;

        const noteId = `diary_daily_${this.getToday()}`
        const tFile = AM.tFile.getDailyNoteTFile(noteId);

        if (tFile) {
            const orb = AM.factory.noteOrbF.forDaily(tFile);
            if (!orb) throw new UnexpectedError();
            todayOrb = orb;
        } else {
            todayOrb = await this._createDailyNote();
            console.log("created TodayNote")
        }

        this._todayNoteOrb = todayOrb;
    }

    get todayNoteOrb(): DailyNoteOrb {
        if (!this._todayNoteOrb) throw new NotInitializedError();
        return this._todayNoteOrb;
    }

    private _today: Date;
    getToday(format: "Y-m-d" | "Y-m-d_D" | "Y-m" | "Y" | "m" | "d" | "D" = "Y-m-d"): string {
        if (format === "Y-m-d") {
            return dateFormat(this._today, "Y-m-d");
        }

        return dateFormat(this._today, format);
    }
    judgeDateChange(date: Date) {
        const targetDay = dateFormat(date, "Y-m-d");
        if (this.getToday() !== targetDay) {
            this._today = date;
            this._createDailyNote();
            alert("The date has changed, and daily note has created.");
            this.writeDailyLogNoteIds();
            alert("writeDailyLogNoteIdsを実行。")
        }
    }

    async writeDailyLogNoteIds() {
        await this.todayNoteOrb.editor.writeDailyRecordNoteIds(this.todayRecordNoteIds);

        recordValues(this.todayRecordNoteIds).forEach(ids => {
            ids.clear();
        });
    }

    getDailyTFile(src: string | Date) {
        const path = this.getDailyNotePath(src);
        if (!path) return;
        return AM.obsidian.vault.getFileByPath(path);
        // return OAM().app.vault.getFileByPath(path);
    }

    // stringはid
    getDailyNotePath(src: string | Date): string | null {
        let date: Date;
        if (typeof src === "string" && src.startsWith("diary_daily")) {
            const dateStr = src.replace("diary_daily_", "");
            const YMD = dateStr.split("-").map(s => Number(s));
            if (YMD.length !== 3) return null;
            date = new Date(YMD[0], YMD[1] - 1, YMD[2]);
        } else if (src instanceof Date) {
            date = src;
        } else {
            throw new UnexpectedError();
        }

        const y = dateFormat(date, "Y");
        const m = dateFormat(date, "m");
        const ymd = dateFormat(date, "Y-m-d");
        return `${AM.orbiz.rootPath}/diaries/daily/${y}/${m}/${ymd}.md`;
        // return `${OAM().rootPath}/diaries/daily/${y}/${m}/${ymd}.md`;
    }

    getDiaryNotePath(id: string): string | null {
        if (id.startsWith("diary_daily_")) {
            return this.getDailyNotePath(id);
        }

        return null;
    }

    getExistingDailyNoteYearsBetween(): [number, number] {
        // const folderPath = `${OAM().rootPath}/diaries/daily`;
        const folderPath = `${AM.orbiz.rootPath}/diaries/daily`;
        //  const folder = OAM().app.vault.getFolderByPath(folderPath);
        const folder = AM.obsidian.vault.getFolderByPath(folderPath);
        if (!folder) throw new UnexpectedError();
        const yearFolders: TFolder[] = folder.children.filter(t => t instanceof TFolder);
        const names = yearFolders.map(t => getBasenameFromPath(t.path));

        const num = Number(names[0]);
        let start: number = num;
        let end: number = num;
        names.forEach(year => {
            const current = Number(year);

            if (current < start) {
                start = current;
            } else {
                end = current;
            }
        });

        return [start, end]
    }
    getExistingDailyNoteMonthsBetween(year: number): [number, number] | null {
        // const folderPath = `${OAM().rootPath}/diaries/daily/${year}`;
        const folderPath = `${AM.orbiz.rootPath}/diaries/daily/${year}`;
        const folder = AM.obsidian.vault.getFolderByPath(folderPath);
        // const folder = OAM().app.vault.getFolderByPath(folderPath);
        if (!folder) return null;
        const monthFolders: TFolder[] = folder.children.filter(t => t instanceof TFolder);
        const names = monthFolders.map(t => getBasenameFromPath(t.path));

        const num = Number(names[0]);
        let start: number = num;
        let end: number = num;
        names.forEach(month => {
            const current = Number(month);
            if (current < start) {
                start = current;
            } else {
                end = current;
            }
        });

        return [start, end]
    }
    private async _createDailyNote(): Promise<DailyNoteOrb> {
        return await AM.useCase.noteCreator.createDailyNote();
    }
}