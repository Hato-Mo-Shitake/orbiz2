import { StdNote } from "./StdNote.entity";

export interface IStdNoteRepository {
    save(note: StdNote): void
}