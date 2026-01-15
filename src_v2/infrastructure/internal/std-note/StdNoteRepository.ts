import { IStdNoteRepository, StdNote, StdNoteId } from "../../../domain/std-note";
import { MarkdownFileReader, MarkdownFileWriter } from "../markdown-file/markdown-file.rules";

export class StdNoteRepository implements IStdNoteRepository {
    constructor(
        private readonly _reader: MarkdownFileReader, // キャッシュreadではなく、直readを注入する。
        private readonly _writer: MarkdownFileWriter
    ) { }

    save(note: StdNote): void {
        // この中で、差分のみの更新を saveFrontmatterAttrs()とかで使って行う
        this._writer.saveFrontmatterAttrs()

    }

    findById(id: StdNoteId): StdNote | null {

    }

    getById(id: StdNoteId): StdNote {

    }
}