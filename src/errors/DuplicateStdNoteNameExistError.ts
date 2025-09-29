import { StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";

export class DuplicateStdNoteNameExistError extends Error {
    constructor(
        readonly duplicateStdNoteOrb: StdNoteOrb
    ) {
        super(`note name: " ${duplicateStdNoteOrb.note.baseName} "is already exist.`);
        this.name = "AlreadyNoteNameExistError";
    }
}