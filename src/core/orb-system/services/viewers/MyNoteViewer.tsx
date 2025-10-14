import { ReactNode } from "react";
import { MyNote } from "src/core/domain/MyNote";
import { RoleNodesDisplay } from "src/looks/components/note-metadata-view/my/RoleNodesDisplay";
import { MyNoteTopSectionDefault } from "src/looks/components/note-top-section/my/MyNoteTopSectionDefault";
import { MyFm } from "src/orbits/schema/frontmatters/fm";
import { MyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { MyFmOrb } from "../../orbs/FmOrb";
import { MyNoteEditor } from "../editors/MyNoteEditor";
import { MyNoteReader } from "../readers/MyNoteReader";
import { StdNoteViewer } from "./StdNoteViewer";

export class MyNoteViewer<
    TFm extends MyFm = MyFm,
    TReader extends MyNoteReader<TFm> = MyNoteReader<TFm>,
    TEditor extends MyNoteEditor<TFm> = MyNoteEditor<TFm>,
> extends StdNoteViewer<TFm, TReader, TEditor> {
    constructor(
        public readonly note: MyNote<TFm>,
        public readonly fmOrb: MyFmOrb,
        public readonly reader: TReader,
        public readonly editor: TEditor,
        public readonly store: StoreApi<MyNoteState>,
    ) {
        super(note, fmOrb, reader, editor, store);
    }

    getTopSection(): React.ReactNode {
        // TODO: ここで状態によって分岐
        return <MyNoteTopSectionDefault
            viewer={this}
        />
    }
    getRoleNodes(): ReactNode {
        return <RoleNodesDisplay
            store={this.store}
            rootNote={this.note}
        // header={"Role Nodes"}
        />
    }
}