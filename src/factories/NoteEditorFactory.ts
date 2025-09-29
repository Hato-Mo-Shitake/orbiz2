import { DailyNote } from "src/core/domain/DailyNote";
import { LogNote } from "src/core/domain/LogNote";
import { MyNote } from "src/core/domain/MyNote";
import { DailyFmOrb, LogFmOrb, MyFmOrb } from "src/core/orb-system/orbs/FmOrb";
import { DailyNoteEditor } from "src/core/orb-system/services/editors/DailyNoteEditor";
import { LogNoteEditor } from "src/core/orb-system/services/editors/LogNoteEditor";
import { MyNoteEditor } from "src/core/orb-system/services/editors/MyNoteEditor";

export class NoteEditorFactory {
    constructor() {
    }

    forMy(note: MyNote, fmOrb: MyFmOrb): MyNoteEditor {
        return new MyNoteEditor(
            note,
            fmOrb
        );
    }

    forLog(note: LogNote, fmOrb: LogFmOrb): LogNoteEditor {
        return new LogNoteEditor(note, fmOrb);
    }

    forDaily(note: DailyNote, fmOrb: DailyFmOrb): DailyNoteEditor {
        return new DailyNoteEditor(note, fmOrb);
    }

    // forStdNote(note: StdNote): StdNoteEditor {
    //     return new StdNoteEditor(note);
    // }

    // forNote(note: Note): NoteEditor {
    //     return new NoteEditor(note);
    // }
}