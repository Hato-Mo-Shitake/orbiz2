import { DailyNoteOrb } from "src/core/orb-system/orbs/NoteOrb";

export class DailyNoteCloser {
    async exec(orb: DailyNoteOrb) {
        await orb.fmOrb.isClosed.setNewValue(true).commitNewValue();
    }
}