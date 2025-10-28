import { AM } from "src/app/AppManager";
import { DailyNote } from "src/core/domain/DailyNote";
import { DailyFm } from "src/orbits/schema/frontmatters/fm";
import { DailyFmOrb } from "../../orbs/FmOrb";
import { DiaryNoteEditor } from "./DiaryNoteEditor";

export class DailyNoteEditor<TFm extends DailyFm = DailyFm> extends DiaryNoteEditor<TFm> {
    constructor(
        public readonly note: DailyNote<TFm>,
        public readonly fmOrb: DailyFmOrb,
    ) {
        super(
            note,
            fmOrb
        );
    }

    async addCommitCreatedNotes(noteId: string) {
        const note = AM.note.getStdNote({ noteId: noteId });
        if (!note) return;

        await this.fmOrb.createdNotes.addNewAVal(note).commitNewValue();
    }
    async addCommitModifiedNotes(noteId: string) {
        const modifiedNoteIds = this.note.fmCache["modifiedNotes"];
        if (!Array.isArray(modifiedNoteIds) || modifiedNoteIds.includes(noteId)) return;

        const note = AM.note.getStdNote({ noteId: noteId });
        if (!note) return;

        await this.fmOrb.modifiedNotes.addNewAVal(note).commitNewValue();
    }
    async addCommitDoneNotes(noteId: string) {
        const note = AM.note.getStdNote({ noteId: noteId });
        if (!note) return;

        await this.fmOrb.doneNotes.addNewAVal(note).commitNewValue();
    }
    async addCommitResolvedNotes(noteId: string) {
        const note = AM.note.getStdNote({ noteId: noteId });
        if (!note) return;

        await this.fmOrb.resolvedNotes.addNewAVal(note).commitNewValue();
    }
}