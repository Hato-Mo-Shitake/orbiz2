import { MyNoteWrapy } from "./MyNoteWrapy";
import { StdNoteId } from "./StdNoteId.vo";

export interface IMyNoteWrapyRepository {
    save(noteWrapy: MyNoteWrapy): void;

    findById(id: StdNoteId): MyNoteWrapy | null;
    getById(id: StdNoteId): MyNoteWrapy;
}