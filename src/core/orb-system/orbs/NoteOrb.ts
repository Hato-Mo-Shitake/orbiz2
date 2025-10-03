import { DailyNote } from "src/core/domain/DailyNote";
import { DiaryNote } from "src/core/domain/DiaryNote";
import { LogNote } from "src/core/domain/LogNote";
import { MyNote } from "src/core/domain/MyNote";
import { BaseNote } from "src/core/domain/Note";
import { StdNote } from "src/core/domain/StdNote";
import { BaseFm, DailyFm, DiaryFm, LogFm, MyFm, StdFm } from "src/orbits/schema/frontmatters/fm";
import { BaseNoteState, LogNoteState, MyNoteState, StdNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { DailyNoteEditor } from "../services/editors/DailyNoteEditor";
import { DiaryNoteEditor } from "../services/editors/DiaryNoteEditor";
import { LogNoteEditor } from "../services/editors/LogNoteEditor";
import { MyNoteEditor } from "../services/editors/MyNoteEditor";
import { BaseNoteEditor } from "../services/editors/NoteEditor";
import { StdNoteEditor } from "../services/editors/StdNoteEditor";
import { DailyNoteReader } from "../services/readers/DailyNoteReader";
import { DiaryNoteReader } from "../services/readers/DiaryNoteReader";
import { LogNoteReader } from "../services/readers/LogNoteReader";
import { MyNoteReader } from "../services/readers/MyNoteReader";
import { BaseNoteReader } from "../services/readers/NoteReader";
import { StdNoteReader } from "../services/readers/StdNoteReader";
import { DailyNoteViewer } from "../services/viewers/DailyNoteViewer";
import { DiaryNoteViewer } from "../services/viewers/DiaryNoteViewer";
import { LogNoteViewer } from "../services/viewers/LogNoteViewer";
import { MyNoteViewer } from "../services/viewers/MyNoteViewer";
import { BaseNoteViewer } from "../services/viewers/NoteViewer";
import { StdNoteViewer } from "../services/viewers/StdNoteViewer";
import { BaseFmOrb, DailyFmOrb, DiaryFmOrb, LogFmOrb, MyFmOrb, StdFmOrb } from "./FmOrb";

export abstract class BaseNoteOrb<TFm extends BaseFm = BaseFm> {
    constructor(
        public readonly note: BaseNote<TFm>,
        public readonly fmOrb: BaseFmOrb,
        public readonly reader: BaseNoteReader<TFm>,
        public readonly editor: BaseNoteEditor<TFm>,
        public readonly viewer: BaseNoteViewer<TFm>,
        public readonly store: StoreApi<BaseNoteState>,
    ) {
    }
}
export function isBaseNoteOrb(noteOrb: any): noteOrb is BaseNoteOrb {
    return noteOrb instanceof BaseNoteOrb;
}

export abstract class StdNoteOrb<TFm extends StdFm = StdFm> extends BaseNoteOrb<TFm> {
    protected readonly _noteStore: StoreApi<StdNoteState> | undefined = undefined;
    constructor(
        public readonly note: StdNote<TFm>,
        public readonly fmOrb: StdFmOrb,
        public readonly reader: StdNoteReader<TFm>,
        public readonly editor: StdNoteEditor<TFm>,
        public readonly viewer: StdNoteViewer<TFm>,
        public readonly store: StoreApi<StdNoteState>,
    ) {
        super(note, fmOrb, reader, editor, viewer, store);
    }

    resetStoreInLinkIds() {
        this.store.getState().setInLinkIds([...this.note.source.inLinkIds]);
    }
    resetStoreoutLinkIds() {
        this.store.getState().setInLinkIds([...this.note.source.outLinkIds]);
    }
}
export function isStdNoteOrb(noteOrb: any): noteOrb is StdNoteOrb {
    return noteOrb instanceof StdNoteOrb;
}

export class MyNoteOrb<TFm extends MyFm = MyFm> extends StdNoteOrb<TFm> {
    protected readonly _noteStore: StoreApi<MyNoteState> | undefined = undefined;
    constructor(
        public readonly note: MyNote<TFm>,
        public readonly fmOrb: MyFmOrb,
        public readonly reader: MyNoteReader<TFm>,
        public readonly editor: MyNoteEditor<TFm>,
        public readonly viewer: MyNoteViewer<TFm>,
        public readonly store: StoreApi<MyNoteState>,
    ) {
        super(note, fmOrb, reader, editor, viewer, store);
    }
}
export function isMyNoteOrb(noteOrb: any): noteOrb is MyNoteOrb {
    return noteOrb instanceof MyNoteOrb;
}

export class LogNoteOrb<TFm extends LogFm = LogFm> extends StdNoteOrb<TFm> {
    constructor(
        public readonly note: LogNote<TFm>,
        public readonly fmOrb: LogFmOrb,
        public readonly reader: LogNoteReader<TFm>,
        public readonly editor: LogNoteEditor<TFm>,
        public readonly viewer: LogNoteViewer<TFm>,
        public readonly store: StoreApi<LogNoteState>,
    ) {
        super(note, fmOrb, reader, editor, viewer, store);
    }
}
export function isLogNoteOrb(noteOrb: any): noteOrb is LogNoteOrb {
    return noteOrb instanceof LogNoteOrb;
}

export abstract class DiaryNoteOrb<TFm extends DiaryFm = DiaryFm> extends BaseNoteOrb<TFm> {
    constructor(
        public readonly note: DiaryNote<TFm>,
        public readonly fmOrb: DiaryFmOrb,
        public readonly reader: DiaryNoteReader<TFm>,
        public readonly editor: DiaryNoteEditor<TFm>,
        public readonly viewer: DiaryNoteViewer<TFm>,
        public readonly store: StoreApi<BaseNoteState>,
    ) {
        super(note, fmOrb, reader, editor, viewer, store);
    }
}
export function isDiaryNoteOrb(noteOrb: any): noteOrb is DiaryNoteOrb {
    return noteOrb instanceof DiaryNoteOrb;
}

export class DailyNoteOrb<TFm extends DailyFm = DailyFm> extends DiaryNoteOrb<TFm> {
    constructor(
        public readonly note: DailyNote<TFm>,
        public readonly fmOrb: DailyFmOrb,
        public readonly reader: DailyNoteReader<TFm>,
        public readonly editor: DailyNoteEditor<TFm>,
        public readonly viewer: DailyNoteViewer<TFm>,
        public readonly store: StoreApi<BaseNoteState>,
    ) {
        super(note, fmOrb, reader, editor, viewer, store);
    }
}
export function isDailyNoteOrb(noteOrb: any): noteOrb is DailyNoteOrb {
    return noteOrb instanceof DailyNoteOrb;
}