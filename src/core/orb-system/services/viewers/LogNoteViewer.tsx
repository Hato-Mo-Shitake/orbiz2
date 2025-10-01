import { LogNote } from "src/core/domain/LogNote";
import { LogNoteTopSection } from "src/looks/components/note-top-section/LogNoteTopSection";
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

    getTopSection(): React.ReactNode {
        return (<>
            {super.getTopSection()}
            <div style={{ margin: "3px" }}>
                <LogNoteTopSection
                    viewer={this}
                />
            </div>

            <h1>Note</h1>
        </>);
    }
}