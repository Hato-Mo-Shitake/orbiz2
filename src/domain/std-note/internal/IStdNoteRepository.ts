import { StdNote } from "./StdNote.entity";
import { StdNoteId } from "./StdNoteId.vo";

export interface IStdNoteRepository {
    save(note: StdNote): void;

    findById(id: StdNoteId): StdNote | null;
    getById(id: StdNoteId): StdNote;
}