import { StdNote } from "./StdNote.entity";
import { StdNoteId } from "./StdNoteId.vo";

export interface StdNoteQueryService {
    findById(id: StdNoteId): StdNote | null;
    getById(id: StdNoteId): StdNote;
}