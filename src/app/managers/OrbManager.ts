import { TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { StdNote } from "src/core/domain/StdNote";
import { DiaryNoteOrb, isLogNoteOrb, isMyNoteOrb, LogNoteOrb, MyNoteOrb, StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { NotInitializedError } from "src/errors/NotInitializedError";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { NoteOrb } from "src/orbits/contracts/note-orb";


export class OrbManager {
    private static _instance: OrbManager | null;

    static setInstance(): void {
        this._instance = new OrbManager(
        );
    }

    static getInstance(): OrbManager {
        if (!this._instance) throw new NotInitializedError();
        return this._instance;
    }

    private constructor(
    ) {
    }

    getNoteOrb(src: { tFile?: TFile, noteId?: string }): NoteOrb | null {
        if (src.tFile) {
            const tFile = src.tFile;
            if (AM.note.isStdNotePath(tFile.path)) {
                return this.getStdNoteOrb({ tFile: tFile });
            } else if (AM.note.isDiaryNotePath(tFile.path)) {
                return this.getDiaryNoteOrb({ tFile })
            } else {
                return null;
            }
        } else if (src.noteId) {
            const stdOrb = this.getStdNoteOrb({ noteId: src.noteId });
            if (stdOrb) return stdOrb;

            const diaryOrb = this.getDiaryNoteOrb({ noteId: src.noteId });
            return diaryOrb;
        } else {
            throw new UnexpectedError();
        }
    }

    getStdNoteOrb(src: { note?: StdNote, tFile?: TFile, noteId?: string, noteName?: string }): StdNoteOrb | null {
        let tFile: TFile;
        let noteId: string;

        if (src.note) {
            tFile = src.note.tFile;
            noteId = src.note.id;
        }
        else if (src.tFile) {
            tFile = src.tFile;
            const tmp = AM.note.getNoteIdByTFile(tFile);
            if (!tmp) return null;
            noteId = tmp;
        } else if (src.noteId) {
            const tmp = AM.tFile.getNoteTFileById(src.noteId);
            if (!tmp) return null;
            tFile = tmp;
            noteId = src.noteId;
        } else if (src.noteName) {
            const tmpId = AM.cache.getStdNoteIdByName(src.noteName);
            if (!tmpId) return null;
            noteId = tmpId;
            const tmp = AM.tFile.getNoteTFileById(noteId);
            if (!tmp) return null;
            tFile = tmp;
        } else {
            throw new UnexpectedError();
        }

        const cached = AM.cache.getStdNoteOrb(noteId);
        if (cached) return cached;

        const newOrb = AM.factory.noteOrbF.tryStdFrom(tFile);

        if (!newOrb) return null;

        AM.cache.setStdNoteOrbCache(noteId, newOrb);

        return newOrb;
    }

    getDiaryNoteOrb(src: { tFile?: TFile, noteId?: string }): DiaryNoteOrb | null {
        let tFile: TFile;
        let noteId: string;
        if (src.tFile) {
            tFile = src.tFile;
            const tmp = AM.note.getNoteIdByTFile(tFile);
            if (!tmp) return null;
            noteId = tmp;
        } else if (src.noteId) {
            const tmp = AM.tFile.getNoteTFileById(src.noteId);

            if (!tmp) return null;
            tFile = tmp;
            noteId = src.noteId;
        } else {
            throw new UnexpectedError();
        }

        if (noteId === AM.diary.todayNoteOrb.note.id) {
            return AM.diary.todayNoteOrb;
        }

        const cached = AM.cache.getDiaryNoteOrb(noteId);
        if (cached) return cached;

        const newOrb = AM.factory.noteOrbF.tryDiaryFrom(tFile);
        if (!newOrb) return null;

        AM.cache.setDiaryNoteOrbCache(noteId, newOrb);

        return newOrb;
    }

    getMyNoteOrb(src: { tFile?: TFile, noteId?: string }): MyNoteOrb | null {
        const orb = this.getStdNoteOrb(src);
        if (!isMyNoteOrb(orb)) return null;
        return orb;
    }

    getLogNoteOrb(src: { tFile?: TFile, noteId?: string }): LogNoteOrb | null {
        const orb = this.getStdNoteOrb(src);
        if (!isLogNoteOrb(orb)) return null;
        return orb;
    }

    getActiveStdNoteOrb(): StdNoteOrb | null {
        const { app } = AM.obsidian;
        const tFile = app.workspace.getActiveFile();
        if (!tFile) return null;
        return this.getStdNoteOrb({ tFile });
    }
}
