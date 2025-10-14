import { DailyNote } from "src/core/domain/DailyNote";
import { DailyNoteTopSectionDefault } from "src/looks/components/note-top-section/daily/DailyNoteTopSectionDefault";
import { DailyFm } from "src/orbits/schema/frontmatters/fm";
import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { DailyFmOrb } from "../../orbs/FmOrb";
import { DailyNoteEditor } from "../editors/DailyNoteEditor";
import { DailyNoteReader } from "../readers/DailyNoteReader";
import { DiaryNoteViewer } from "./DiaryNoteViewer";

export class DailyNoteViewer<
    TFm extends DailyFm = DailyFm,
    TReader extends DailyNoteReader<TFm> = DailyNoteReader<TFm>,
    TEditor extends DailyNoteEditor<TFm> = DailyNoteEditor<TFm>,
> extends DiaryNoteViewer<TFm, TReader, TEditor> {
    constructor(
        public readonly note: DailyNote<TFm>,
        public readonly fmOrb: DailyFmOrb,
        public readonly reader: TReader,
        public readonly editor: TEditor,
        public readonly store: StoreApi<DailyNoteState>
    ) {
        super(note, fmOrb, reader, editor, store);
    }

    // getFmAttrs(): React.ReactNode {
    //     return (<>
    //         {super.getFmAttrs()}
    //         {this.fmOrb.theDay.getView()}
    //         {this.fmOrb.createdNotes.getView()}
    //         {this.fmOrb.modifiedNotes.getView()}
    //         {this.fmOrb.resolvedNotes.getView()}
    //         {this.fmOrb.amountSpent.getView()}
    //         {this.fmOrb.templateDone.getView()}
    //     </>)
    // }
    // getFmAttrsEditor(): React.ReactNode {
    //     return (<>
    //         {super.getFmAttrsEditor()}
    //         {this.fmOrb.theDay.getEditableView()}
    //         {this.fmOrb.createdNotes.getEditableView()}
    //         {this.fmOrb.modifiedNotes.getEditableView()}
    //         {this.fmOrb.resolvedNotes.getEditableView()}
    //         {this.fmOrb.amountSpent.getEditableView()}
    //         {this.fmOrb.templateDone.getEditableView()}
    //     </>)
    // }
    getTopSection(): React.ReactNode {
        return (<>
            <DailyNoteTopSectionDefault
                viewer={this}
            />
        </>)
    }
}