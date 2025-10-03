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

    getTestLooks(): React.ReactNode {
        return (<>
            {this.getFmAttrs()}
            {this.getFmAttrsEditor()}
            <div>以下tree</div>
            {fmKeysForStdLinkedNoteList.map(key => {
                return linkedNoteDirectionList.map(d =>
                    <div key={`${key}-${d}`}>
                        {`${key}-${d}`}
                        {this.getLinkedStdNote(key, d)}
                    </div>

                )
            })}
        </>
        );
    }

    getFmAttrs(): React.ReactNode {
        return (<>
            {super.getFmAttrs()}
            {this.fmOrb.subType.getView()}
            {this.fmOrb.belongsTo.getView()}
            {this.fmOrb.relatesTo.getView()}
            {this.fmOrb.references.getView()}
        </>)
    }
    getFmAttrsEditor(): React.ReactNode {
        return (<>
            {super.getFmAttrsEditor()}
            {this.fmOrb.belongsTo.getEditableView()}
            {this.fmOrb.relatesTo.getEditableView()}
            {this.fmOrb.references.getEditableView()}
        </>)
    }

    getLinkedStdNote(fmKey: FmKey<"stdLinkedNoteList">, direction: LinkedNoteDirection): React.ReactNode {
        return <LinkedStdNoteDisplay
            store={this.store}
            rootNote={this.note}
            fmKey={fmKey}
            direction={direction}
        />
    }
    getLinkedStdNoteList() {
        return (<>
            {fmKeysForStdLinkedNoteList.map(key => {
                return linkedNoteDirectionList.map(d =>
                    <div key={`${key}-${d}`}>
                        {`${key}-${d}`}
                        {this.getLinkedStdNote(key, d)}
                    </div>

                )
            })}
        </>)
    }

    getTopSection(): React.ReactNode {
        return (
            super.getTopSection()
        );
    }

    // getOutLinks(key: FmKey<"stdLinkedNoteList">): React.ReactNode {
    //     const ids = this.reader.getOutLinkIds(key);
    //     if (ids.length === 0) return null;

    //     return <LinkedNoteLinks
    //         ids={ids}
    //         rootNotePath={this.note.path}
    //     />
    // }
    // getInLinks(key: FmKey<"stdLinkedNoteList">): React.ReactNode {
    //     const ids = this.reader.getInLinkIds(key);
    //     if (ids.length === 0) return null;

    //     return <LinkedNoteLinks
    //         ids={ids}
    //         rootNotePath={this.note.path}
    //     />
    // }
    // getOutLinkTree(key: FmKey<"stdLinkedNoteList">): React.ReactNode {
    //     const idTrees = this.reader.getOutLinkTree(key);
    //     if (idTrees.length === 0) return null;

    //     return <LinkedNoteLinkTree
    //         idTrees={idTrees}
    //         rootNotePath={this.note.path}
    //     />
    // }
    // getInLinkTree(key: FmKey<"stdLinkedNoteList">): React.ReactNode {
    //     const idTrees = this.reader.getInLinkTree(key);
    //     if (idTrees.length === 0) return null;

    //     return <LinkedNoteLinkTree
    //         idTrees={idTrees}
    //         rootNotePath={this.note.path}
    //     />
    // }
}