import { TFile } from "obsidian";
import { DiaryNoteOrb, isLogNoteOrb, isMyNoteOrb, LogNoteOrb, MyNoteOrb, StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { NoteOrb } from "src/orbits/contracts/note-orb";
import { OAM } from "./OrbizAppManager";
import { OCM } from "./OrbizCacheManager";
import { ODM } from "./OrbizDiaryManager";
import { OEM } from "./OrbizErrorManager";
import { OFM } from "./OrbizFactoryManager";
import { ONM } from "./OrbizNoteManager";
import { OTM } from "./OrbizTFileManager";

export class OrbizOrbManager {
    private static _instance: OrbizOrbManager | null;

    static setInstance(): void {
        this._instance = new OrbizOrbManager(
        );
    }

    static getInstance(): OrbizOrbManager {
        if (!this._instance) OEM.throwNotInitializedError(OrbizOrbManager);

        return this._instance;
    }

    /** --------------------------------------------------------------------- */

    private constructor(
    ) {
    }

    getNoteOrb(src: { tFile?: TFile, noteId?: string }): NoteOrb | null {
        if (src.tFile) {
            const tFile = src.tFile;
            if (ONM().isStdNotePath(tFile.path)) {
                return this.getStdNoteOrb({ tFile: tFile });
            } else if (ONM().isDiaryNotePath(tFile.path)) {
                return this.getDiaryNoteOrb({ tFile })
            } else {
                // TODO: dailyNoteOrbを持ってこないと。
                OEM.throwNotImplementedError();
            }
        } else if (src.noteId) {
            const stdOrb = this.getStdNoteOrb({ noteId: src.noteId });
            if (stdOrb) return stdOrb;

            const diaryOrb = this.getDiaryNoteOrb({ noteId: src.noteId });
            return diaryOrb;

            OEM.throwNotImplementedError();
        } else {
            OEM.throwUnexpectedError();
        }
    }

    getStdNoteOrb(src: { tFile?: TFile, noteId?: string, noteName?: string }): StdNoteOrb | null {
        let tFile: TFile;
        let noteId: string;
        if (src.tFile) {
            tFile = src.tFile;
            const tmp = ONM().getNoteIdByTFile(tFile);
            if (!tmp) return null;
            noteId = tmp;
        } else if (src.noteId) {
            // const tmp = OCM().getTFileByNoteId(src.noteId);
            const tmp = OTM().getNoteTFileById(src.noteId);
            if (!tmp) return null;
            tFile = tmp;
            noteId = src.noteId;
        } else if (src.noteName) {
            const tmpId = OCM().getStdNoteIdByName(src.noteName);
            if (!tmpId) return null;
            noteId = tmpId;
            const tmp = OTM().getNoteTFileById(noteId);
            if (!tmp) return null;
            tFile = tmp;
        } else {
            OEM.throwUnexpectedError();
        }

        const cached = OCM().getStdNoteOrb(noteId);
        // console.warn("noteId", noteId, "cached", cached);
        if (cached) return cached;

        const newOrb = OFM().noteOrbF.tryStdFrom(tFile);

        if (!newOrb) return null;

        OCM().setStdNoteOrbCache(noteId, newOrb);

        return newOrb;
    }

    getDiaryNoteOrb(src: { tFile?: TFile, noteId?: string }): DiaryNoteOrb | null {
        let tFile: TFile;
        let noteId: string;
        if (src.tFile) {
            tFile = src.tFile;
            const tmp = ONM().getNoteIdByTFile(tFile);
            if (!tmp) return null;
            noteId = tmp;
        } else if (src.noteId) {
            const tmp = OTM().getNoteTFileById(src.noteId);

            if (!tmp) return null;
            tFile = tmp;
            noteId = src.noteId;
        } else {
            OEM.throwUnexpectedError();
        }

        if (noteId === ODM().todayNoteOrb.note.id) {
            return ODM().todayNoteOrb;
        }

        const cached = OCM().getDiaryNoteOrb(noteId);
        // console.warn("noteId", noteId, "cached", cached);
        if (cached) return cached;

        const newOrb = OFM().noteOrbF.tryDiaryFrom(tFile);
        if (!newOrb) return null;

        OCM().setDiaryNoteOrbCache(noteId, newOrb);

        return newOrb;
    }

    // getStdNoteOrb(source: NoteSource | TFile): StdNoteOrb | null {
    //     const orb = this.getNoteOrb(source);
    //     if (!isStdNoteOrb(orb)) return null;
    //     return orb;
    // }

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
        const { app } = OAM();
        const tFile = app.workspace.getActiveFile();
        if (!tFile) return null;
        return this.getStdNoteOrb({ tFile });
    }
}

export const OOM = () => {
    return OrbizOrbManager.getInstance();
}

