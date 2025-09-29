import { FmOrbFactory } from "src/factories/FmOrbFactory";
import { NoteEditorFactory } from "src/factories/NoteEditorFactory";
import { NoteFactory } from "src/factories/NoteFactory";
import { NoteOrbFactory } from "src/factories/NoteOrbFactory";
import { NoteReaderFactory } from "src/factories/NoteReaderFactory";
import { NoteViewerFactory } from "src/factories/NoteViewerFactory";
import { OEM } from "./OrbizErrorManager";

export class OrbizFactoryManager {
    private static _instance: OrbizFactoryManager | null = null;

    static setInstance(): void {
        const fmOrbF = new FmOrbFactory();
        // const noteFmBuilderF = new NoteFmBuilderFactory(noteFmF);
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

        this._instance = new OrbizFactoryManager(
            noteF,
            fmOrbF,
            noteReaderF,
            noteEditorF,
            noteViewerF,
            noteOrbF
        );
    }

    static getInstance(): OrbizFactoryManager {
        if (!this._instance) OEM.throwNotInitializedError();
        return this._instance;
    }




    private constructor(
        // public readonly noteFmBuilderF: NoteFmBuilderFactory,
        public readonly noteF: NoteFactory,
        public readonly fmOrbF: FmOrbFactory,
        public readonly noteReaderF: NoteReaderFactory,
        public readonly noteEditorF: NoteEditorFactory,
        public readonly noteViewerF: NoteViewerFactory,
        public readonly noteOrbF: NoteOrbFactory,
    ) { }
}

export const OFM = () => {
    return OrbizFactoryManager.getInstance();
}