import { AM } from "src/app/AppManager";
import { generateUUID } from "src/assistance/utils/uuid";
import { RoleNodeConf } from "src/orbits/contracts/create-note";
import { BaseFm, DailyFm, DiaryFm, LogFm, MyFm, StdFm } from "src/orbits/schema/frontmatters/fm";
import { DiaryNoteType, LogNoteType, MyNoteType } from "src/orbits/schema/frontmatters/NoteType";

export abstract class BaseFmBuilder<TFm extends BaseFm = BaseFm> {
    protected _fm: Partial<TFm> = {};
    constructor(id: string) {
        this._fm["id"] = id;
        this._fm["tags"] = [];
    }

    build(isDeepCopy = false): TFm {
        // TODO: もっといい方法があれば。。。。
        const fm = this._fm as unknown as TFm;

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
    constructor(
        subType: MyNoteType,
        roleNodeConf?: RoleNodeConf
    ) {
        super();
        this._fm["type"] = "myNote";
        this._fm["subType"] = subType;

        this._fm["rank"] = 0;
        this._fm["categories"] = [];
        this._fm["aliases"] = [];
        this._fm["aspect"] = "";

        if (roleNodeConf) {
            this._fm["roleKind"] = roleNodeConf.kind;
            this._fm["roleHub"] = roleNodeConf.hub.internalLink;
        } else {
            this._fm["roleKind"] = "";
            this._fm["roleHub"] = "";
        }
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
        super(`${daily}_${AM.diary.getToday()}`, daily);
        this._fm["theDay"] = (new Date()).getTime();
        this._fm["createdNotes"] = [];
        this._fm["modifiedNotes"] = [];
        this._fm["resolvedNotes"] = [];
        this._fm["amountSpent"] = null;
        this._fm["templateDone"] = [];
    }
}
