import { MyNoteRank } from "./MyNoteRank.vo";
import { StdNote } from "./StdNote.entity";

export class MyNoteWrapy {
    constructor(
        private readonly _note: StdNote,
        private _rank: MyNoteRank
    ) { }

    getNote(): StdNote {
        return this._note;
    }
    getRank(): MyNoteRank {
        return this._rank;
    }
}