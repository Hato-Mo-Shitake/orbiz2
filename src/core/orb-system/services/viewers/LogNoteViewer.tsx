import { LogNote } from "src/core/domain/LogNote";
import { LogNoteTopSectionDefault } from "src/looks/components/note-top-section/log/LogNoteTopSectionDefault";
import { LogFm } from "src/orbits/schema/frontmatters/fm";
import { LogNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { LogFmOrb } from "../../orbs/FmOrb";
import { LogNoteEditor } from "../editors/LogNoteEditor";
import { LogNoteReader } from "../readers/LogNoteReader";
import { StdNoteViewer } from "./StdNoteViewer";

export class LogNoteViewer<
    TFm extends LogFm = LogFm,
    TReader extends LogNoteReader<TFm> = LogNoteReader<TFm>,
    TEditor extends LogNoteEditor<TFm> = LogNoteEditor<TFm>,
> extends StdNoteViewer<TFm, TReader, TEditor> {
    constructor(
        public readonly note: LogNote<TFm>,
        public readonly fmOrb: LogFmOrb,
        public readonly reader: TReader,
        public readonly editor: TEditor,
        public readonly store: StoreApi<LogNoteState>,
    ) {
        super(note, fmOrb, reader, editor, store);
    }

    // getFmAttrs(): React.ReactNode {
    //     return (<>
    //         {super.getFmAttrs()}
    //         {this.fmOrb.status.getView()}
    //         {this.fmOrb.due.getView()}
    //         {this.fmOrb.resolved.getView()}
    //         {this.fmOrb.context.getView()}
    //     </>)
    // }
    // getFmAttrsEditor(): React.ReactNode {
    //     return (<>
    //         {super.getFmAttrsEditor()}
    //         {this.fmOrb.status.getEditableView()}
    //         {this.fmOrb.due.getEditableView()}
    //         {/* TODO: ここもっと綺麗にループ処理でまとめるように */}
    //         {!this.fmOrb.resolved.isImmutable && this.fmOrb.resolved.getEditableView()}
    //         {this.fmOrb.context.getEditableView()}
    //     </>)
    // }

    getTopSection(): React.ReactNode {
        return <LogNoteTopSectionDefault
            viewer={this}
        />
    }
}