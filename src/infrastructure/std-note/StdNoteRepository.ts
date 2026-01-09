import { IStdNoteRepository, StdNote, StdNoteId } from "../../domain/std-note";


IFileSurfacy < NoteMetadata > を使って実装
現状では、ObsidianMarkdownFileSurfacyを注入

export class StdNoteRepository implements IStdNoteRepository {
    save(note: StdNote): void {

    }

    findById(id: StdNoteId): StdNote | null {

    }

    getById(id: StdNoteId): StdNote {

    }
}