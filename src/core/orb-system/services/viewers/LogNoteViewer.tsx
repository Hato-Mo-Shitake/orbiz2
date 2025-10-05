import { LogNote } from "src/core/domain/LogNote";
import { CreateLogNoteButton } from "src/looks/components/common-orbiz/CreateLogNoteButton";
import { CreateMyNoteButton } from "src/looks/components/common-orbiz/CreateMyNoteButton";
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

    getFmAttrs(): React.ReactNode {
        return (<>
            {super.getFmAttrs()}
            {this.fmOrb.status.getView()}
            {this.fmOrb.due.getView()}
            {this.fmOrb.resolved.getView()}
            {this.fmOrb.context.getView()}
        </>)
    }
    getFmAttrsEditor(): React.ReactNode {
        return (<>
            {super.getFmAttrsEditor()}
            {this.fmOrb.status.getEditableView()}
            {this.fmOrb.due.getEditableView()}
            {/* TODO:  ここもっと綺麗にループ処理でまとめるように */}
            {!this.fmOrb.resolved.isImmutable && this.fmOrb.resolved.getEditableView()}
            {this.fmOrb.context.getEditableView()}
        </>)
    }

    getTopSection(): React.ReactNode {
        return (<>
            <div>
                {super.getTopSection()}
            </div>
            < div style={{ marginTop: "0.9em", display: "flex", alignItems: "center", gap: "0.2em" }}>
                create:
                <CreateMyNoteButton rootNote={this.note} label="my" />
                <CreateLogNoteButton rootNote={this.note} label="log" />
            </div >
            <div style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>
                <hr />
            </div>
            {this.fmOrb.status.getView()}
            {this.fmOrb.due.getView()}
            {this.fmOrb.resolved.getView()}
            {this.fmOrb.context.getView()}
            <div style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>
                <hr />
            </div>
            {this.getLinkedStdNoteList()}
            <h1>Note</h1>
        </>)
    }
}