import * as React from "react";
import { StdNote } from "src/core/domain/StdNote";
import { LinkedStdNoteDisplay } from "src/looks/components/note-metadata-view/std/LinkedStdNoteDisplay";
import { LinkedNoteDirection, linkedNoteDirectionList } from "src/orbits/contracts/create-note";
import { FmKey } from "src/orbits/contracts/fmKey";
import { StdFm } from "src/orbits/schema/frontmatters/fm";
import { fmKeysForStdLinkedNoteList } from "src/orbits/schema/frontmatters/FmKey";
import { StdNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { StdFmOrb } from "../../orbs/FmOrb";
import { StdNoteEditor } from "../editors/StdNoteEditor";
import { StdNoteReader } from "../readers/StdNoteReader";
import { BaseNoteViewer } from "./NoteViewer";

export abstract class StdNoteViewer<
    TFm extends StdFm = StdFm,
    TReader extends StdNoteReader<TFm> = StdNoteReader<TFm>,
    TEditor extends StdNoteEditor<TFm> = StdNoteEditor<TFm>,
> extends BaseNoteViewer<TFm, TReader, TEditor> {
    constructor(
        public readonly note: StdNote<TFm>,
        public readonly fmOrb: StdFmOrb,
        public readonly reader: TReader,
        public readonly editor: TEditor,
        public readonly store: StoreApi<StdNoteState>,
    ) {
        super(note, fmOrb, reader, editor, store);
    }

    getLinkedStdNote(fmKey: FmKey<"stdLinkedNoteList">, direction: LinkedNoteDirection): React.ReactNode {
        const headerMap: Record<FmKey<"stdLinkedNoteList">, Record<LinkedNoteDirection, string>> = {
            "belongsTo": { "in": "children:", "out": "parents:" },
            "relatesTo": { "in": "relative children:", "out": "relative elder:" },
            "references": { "in": "referenced:", "out": "references:" }
        }

        return <LinkedStdNoteDisplay
            store={this.store}
            rootNote={this.note}
            fmKey={fmKey}
            direction={direction}
            header={headerMap[fmKey][direction]}
        />
    }
    getLinkedStdNoteList() {
        return (<>
            {fmKeysForStdLinkedNoteList.map(key => {
                return [...linkedNoteDirectionList].reverse().map(d =>
                    <div key={`${key}-${d}`}>
                        {this.getLinkedStdNote(key, d)}
                    </div>

                )
            })}
        </>)
    }
}