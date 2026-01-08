import { NotInitializedError } from "src/errors/NotInitializedError";
import { FmOrbFactory } from "src/factories/FmOrbFactory";
import { NoteEditorFactory } from "src/factories/NoteEditorFactory";
import { NoteFactory } from "src/factories/NoteFactory";
import { NoteOrbFactory } from "src/factories/NoteOrbFactory";
import { NoteReaderFactory } from "src/factories/NoteReaderFactory";
import { NoteViewerFactory } from "src/factories/NoteViewerFactory";


export class FactoryManager {
    private static _instance: FactoryManager | null = null;

    static setInstance(): void {
        const fmOrbF = new FmOrbFactory();
        const noteF = new NoteFactory();
        const noteReaderF = new NoteReaderFactory();
        const noteEditorF = new NoteEditorFactory();
        const noteViewerF = new NoteViewerFactory(
            noteReaderF,
            noteEditorF
        );
        const noteOrbF = new NoteOrbFactory(
            noteF,
            fmOrbF,
            noteReaderF,
            noteEditorF,
            noteViewerF
        );

        this._instance = new FactoryManager(
            noteF,
            fmOrbF,
            noteReaderF,
            noteEditorF,
            noteViewerF,
            noteOrbF
        );
    }

    static getInstance(): FactoryManager {
        if (!this._instance) throw new NotInitializedError();
        // OEM.throwNotInitializedError();
        return this._instance;
    }

    private constructor(
        public readonly noteF: NoteFactory,
        public readonly fmOrbF: FmOrbFactory,
        public readonly noteReaderF: NoteReaderFactory,
        public readonly noteEditorF: NoteEditorFactory,
        public readonly noteViewerF: NoteViewerFactory,
        public readonly noteOrbF: NoteOrbFactory,
    ) { }
}
