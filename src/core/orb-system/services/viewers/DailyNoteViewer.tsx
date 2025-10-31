import { ReactNode } from "react";
import { DailyNote } from "src/core/domain/DailyNote";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { DailyLogNoteListDisplay } from "src/looks/components/note-metadata-view/daily/DailyLogNoteListDisplay";
import { DailyNoteTopSectionDefault } from "src/looks/components/note-top-section/daily/DailyNoteTopSectionDefault";
import { FmKey } from "src/orbits/contracts/fmKey";
import { DailyFm } from "src/orbits/schema/frontmatters/fm";
import { fmKeysForDailyLinkedNoteList } from "src/orbits/schema/frontmatters/FmKey";
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

    getTopSection(): React.ReactNode {
        return <DailyNoteTopSectionDefault
            viewer={this}
        />
    }

    getDailyLogNoteDisplay(fmKey: FmKey<"dailyLinkedNoteList">): ReactNode {
        switch (fmKey) {
            case ("createdNotes"):
                return (<>
                    <DailyLogNoteListDisplay
                        store={this.store}
                        selector={state => state.fmAttrCreatedNotes}
                        header={fmKey}
                    />
                </>)

            case ("modifiedNotes"):
                return <DailyLogNoteListDisplay
                    store={this.store}
                    selector={state => state.fmAttrModifiedNotes}
                    header={fmKey}
                />
            case ("doneNotes"):
                return <DailyLogNoteListDisplay
                    store={this.store}
                    selector={state => state.fmAttrDoneNotes}
                    header={fmKey}
                />
            case ("resolvedNotes"):
                return <DailyLogNoteListDisplay
                    store={this.store}
                    selector={state => state.fmAttrResolvedNotes}
                    header={fmKey}
                />
            default:
                throw new UnexpectedError();
        }
    }

    getDailyLogNoteList() {
        return (<>
            {fmKeysForDailyLinkedNoteList.map(key =>
                <div key={`${key}`}>
                    {this.getDailyLogNoteDisplay(key)}
                </div>
            )}
        </>)
    }
}