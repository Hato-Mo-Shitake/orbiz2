import { generateUUID } from "src/assistance/utils/uuid";
import { BaseFm, DailyFm, DiaryFm, LogFm, MyFm, StdFm } from "src/orbits/schema/frontmatters/fm";
import { DiaryNoteType, LogNoteType, MyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";

export abstract class BaseFmBuilder<TFm extends BaseFm = BaseFm> {
    protected _fm: Partial<TFm> = {};
    // protected _fm: TFm;
    constructor(id: string) {
        this._fm["id"] = id;
        this._fm["tags"] = [];
    }

    build(isDeepCopy: boolean = false): TFm {
        // TODO: もっといい方法があれば。。。。
        const fm = this._fm as unknown as TFm;
        // const fm = this._fm;

        if (isDeepCopy) {
            return structuredClone(fm);
        }

        return fm;
    }
}

export abstract class StdFmBuilder<TFm extends StdFm = StdFm> extends BaseFmBuilder<TFm> {
    constructor() {
        super(generateUUID());
        this._fm["belongsTo"] = [];
        this._fm["relatesTo"] = [];
        this._fm["references"] = [];
    }
}

export class MyFmBuilder<TFm extends MyFm = MyFm> extends StdFmBuilder<TFm> {
    constructor(subType: MyNoteType) {
        super();
        this._fm["type"] = "myNote";
        this._fm["subType"] = subType;

        this._fm["rank"] = 0;
        this._fm["categories"] = [];
        this._fm["aliases"] = [];
        this._fm["aspect"] = "";
        this._fm["roleKind"] = "";
        this._fm["roleHub"] = "";
    }
}

export class LogFmBuilder<TFm extends LogFm = LogFm> extends StdFmBuilder<TFm> {
    constructor(subType: LogNoteType) {
        super();
        this._fm["type"] = "logNote";
        this._fm["subType"] = subType;

        this._fm["status"] = "";
        this._fm["due"] = null;
        this._fm["resolved"] = null;
        this._fm["context"] = "";
    }
}

export abstract class DiaryFmBuilder<TFm extends DiaryFm = DiaryFm> extends BaseFmBuilder<TFm> {
    constructor(_id: string, subType: DiaryNoteType) {
        const id = "diary_" + _id;

        super(id);
        this._fm["type"] = "diaryNote";
        this._fm["subType"] = subType;

        this._fm["score"] = null;
        this._fm["isClosed"] = false;
    }
}

export class DailyFmBuilder<TFm extends DailyFm = DailyFm> extends DiaryFmBuilder<TFm> {
    constructor() {
        const daily = "daily" as const;
        super(`${daily}_${ODM().getToday()}`, daily);
        this._fm["theDay"] = (new Date()).getTime();
        this._fm["createdNoteIds"] = [];
        this._fm["modifiedNoteIds"] = [];
        this._fm["resolvedNoteIds"] = [];
        this._fm["amountSpent"] = null;
        this._fm["templateDone"] = [];
    }
}
