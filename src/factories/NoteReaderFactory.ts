import { DailyNote } from "src/core/domain/DailyNote";
import { LogNote } from "src/core/domain/LogNote";
import { MyNote } from "src/core/domain/MyNote";
import { DailyFmOrb, LogFmOrb, MyFmOrb } from "src/core/orb-system/orbs/FmOrb";
import { DailyNoteReader } from "src/core/orb-system/services/readers/DailyNoteReader";
import { LogNoteReader } from "src/core/orb-system/services/readers/LogNoteReader";
import { MyNoteReader } from "src/core/orb-system/services/readers/MyNoteReader";


export class NoteReaderFactory {
    constructor() {
    }

    forMy(note: MyNote, fmOrb: MyFmOrb): MyNoteReader {
        return new MyNoteReader(note, fmOrb);
    }

    forLog(note: LogNote, fmOrb: LogFmOrb): LogNoteReader {
        return new LogNoteReader(note, fmOrb);
    }

    forDaily(note: DailyNote, fmOrb: DailyFmOrb): DailyNoteReader {
        return new DailyNoteReader(note, fmOrb);
    }

    // forStdNote(note: StdNote): StdNoteReader {
    //     return new StdNoteReader(note);
    // }

    // forNote(note: Note): NoteReader {
    //     return new NoteReader(note);
    // }
}