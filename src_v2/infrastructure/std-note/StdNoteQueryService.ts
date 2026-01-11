import { IStdNoteQueryService, StdNote, StdNoteId } from "../../domain/std-note";
import { MarkdownFileReader } from "../markdown-file/markdown-file.rules";
import { IStdNoteStore, StdNoteSourceMap } from "./IStdNoteCacheMaintainer";



export class StdNoteQueryService implements IStdNoteQueryService {
    private readonly _sourceMap: StdNoteSourceMap;

    private constructor(
        private readonly _reader: MarkdownFileReader,
        private readonly _store: IStdNoteStore,
        // private readonly _appEnvReader: IAppEnvReader,
    ) {
        this._sourceMap = _store.buildSourceMap();
    }

    // static initialize(
    //     reader: MarkdownFileReader,
    //     // appEnvReader: IAppEnvReader,
    // ): StdNoteQueryService {

    //     // ここでキャッシュ構築

    //     return new StdNoteQueryService(
    //         reader,
    //         // appEnvReader
    //     );
    // }

    findById(id: StdNoteId): StdNote | null {

    }

    getById(id: StdNoteId): StdNote {

    }
}