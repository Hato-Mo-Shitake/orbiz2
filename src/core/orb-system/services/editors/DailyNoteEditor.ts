import { DailyNote } from "src/core/domain/DailyNote";
import { StdNote } from "src/core/domain/StdNote";
import { DailyFm } from "src/orbits/schema/frontmatters/fm";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
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

    async writeDailyRecordNoteIds({
        cIds, mIds, rIds
    }: {
        cIds: Set<string>,
        mIds: Set<string>,
        rIds: Set<string>,
    }) {
        const cNotes: Map<string, StdNote> = new Map();
        const mNotes: Map<string, StdNote> = new Map();
        const rNotes: Map<string, StdNote> = new Map();

        mIds.forEach(id => {
            const note = ONM().getStdNote({ noteId: id })!;
            mNotes.set(id, note);
        });

        cIds.forEach(id => {
            const mNote = mNotes.get(id);
            if (mNote) {
                cNotes.set(id, mNote)
            } else {
                const note = ONM().getStdNote({ noteId: id })!;
                cNotes.set(id, note);
            }
        });

        rIds.forEach(id => {
            const mcNote = mNotes.get(id) || cNotes.get(id);

            if (mcNote) {
                rNotes.set(id, mcNote)
            } else {
                const note = ONM().getStdNote({ noteId: id })!;
                rNotes.set(id, note);
            }
        });

        if (cNotes.size) await this.fmOrb.createdNoteIds.mergeNewValue([...cNotes.values()]).commitNewValue();
        if (mNotes.size) await this.fmOrb.modifiedNoteIds.mergeNewValue([...mNotes.values()]).commitNewValue();
        if (rNotes.size) await this.fmOrb.resolvedNoteIds.mergeNewValue([...rNotes.values()]).commitNewValue();
    }
}