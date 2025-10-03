import { ReactNode } from "react";
import { MyNote } from "src/core/domain/MyNote";
import { CreateLogNoteButton } from "src/looks/components/common-orbiz/CreateLogNoteButton";
import { CreateMyNoteButton } from "src/looks/components/common-orbiz/CreateMyNoteButton";
import { CreateRoleNodeButton } from "src/looks/components/common-orbiz/CreateRoleNodeButton";
import { NoteLink } from "src/looks/components/common/NoteLink";
import { LinkedNoteLinks } from "src/looks/components/note-metadata-view/DisplayLinkedNoteLinks";
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

    getFmAttrs(): React.ReactNode {
        return (<>
            {super.getFmAttrs()}
            {this.fmOrb.rank.getView()}
            {this.fmOrb.categories.getView()}
            {this.fmOrb.aliases.getView()}
            {this.fmOrb.aspect.getView()}
            {this.fmOrb.roleKind.getView()}
            {this.fmOrb.roleHub.getView()}
        </>)
    }
    getFmAttrsEditor(): React.ReactNode {
        return (<>
            {super.getFmAttrsEditor()}
            {this.fmOrb.rank.getEditableView()}
            {this.fmOrb.categories.getEditableView()}
            {this.fmOrb.aliases.getEditableView()}
            {this.fmOrb.aspect.getEditableView()}
            {this.fmOrb.roleKind.getEditableView()}
            {this.fmOrb.roleHub.getEditableView()}
        </>)
    }

    getTopSection(): React.ReactNode {
        return (<>
            <div>
                {super.getTopSection()}
            </div>
            < div style={{ margin: "10px", display: "flex", alignItems: "center", gap: "0.2em" }}>
                create:
                <div style={{ margin: "10px", display: "flex", alignItems: "center", gap: "0.0em" }}>
                    <CreateMyNoteButton rootNote={this.note} label="my" />
                    <div>
                        <span>（</span>
                        <CreateRoleNodeButton rootNote={this.note} label="role-node" />
                        <span>）</span>
                    </div>
                </div>
                <CreateLogNoteButton rootNote={this.note} label="log" />
            </div >
            {this.fmOrb.tags.getView()}
            {this.fmOrb.categories.getView()}
            {this.getLinkedStdNoteList()}
            <h1>Note</h1>
        </>)
    }
    getRoleHub(): ReactNode {
        const hub = this.fmOrb.roleHub.value;
        if (!hub) return null;
        return <NoteLink
            linkText={hub.path}
        />;
    }
    getRoleNodes(): ReactNode {
        const ids = this.reader.getInLinkIds("roleHub");
        if (ids.length === 0) return null;

        return <LinkedNoteLinks
            ids={ids}
            rootNotePath={this.note.path}
            cutSlug={`@${this.note.baseName}`}
        />
    }

    // getFmEditBox(): ReactNode {
    //     return (<>
    //         <FmEditBox editor={this.editor} >
    //             {this.fmViewers.map(viewer => (
    //                 <div key={viewer.fmKey}>
    //                     {
    //                         (!viewer.isImmutable && !["roleHub", "roleKind"].includes(viewer.fmKey))
    //                         && viewer.getEditBox()
    //                     }
    //                 </div>
    //             ))}
    //         </FmEditBox>
    //     </>)
    // }
    protected _getTopSectionDefault(): ReactNode {
        return (<>
            {/* {super.getTopSection()}
            <div style={{ margin: "3px" }}>
                <MyNoteTopSection
                    viewer={this}
                />
            </div>
            <h1>Note</h1> */}
        </>)
    }
    protected _getTopSectionIndex(): ReactNode {
        return (<>
            {/* <div style={{ margin: "3px" }}>
                <AspectIndexTopSection
                    viewer={this}
                />
            </div>
            <hr /> */}
        </>)
    }
}