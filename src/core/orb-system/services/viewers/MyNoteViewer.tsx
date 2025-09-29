import { ReactNode } from "react";
import { MyNote } from "src/core/domain/MyNote";
import { NoteLink } from "src/looks/components/common/NoteLink";
import { FmEditBox } from "src/looks/components/fm-edit/main/FmEditBox";
import { LinkedNoteLinks } from "src/looks/components/fm-view/DisplayLinkedNoteLinks";
import { AspectIndexTopSection } from "src/looks/components/note-top-section/aspects/AspectIndexTopSection";
import { MyNoteTopSection } from "src/looks/components/note-top-section/MyNoteTopSection";
import { MyFm } from "src/orbits/schema/frontmatters/fm";
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
    ) {
        super(note, fmOrb, reader, editor);
    }

    getTopSection(): React.ReactNode {
        let el: ReactNode;
        switch (this.fmOrb.aspect.value) {
            case ("index"):
                el = this._getTopSectionIndex();
                break;
            default:
                el = this._getTopSectionDefault();
        }
        return (<>
            {el}
        </>);
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

    getFmEditBox(): ReactNode {
        return (<>
            <FmEditBox editor={this.editor} >
                {this.fmViewers.map(viewer => (
                    <div key={viewer.fmKey}>
                        {
                            (!viewer.isImmutable && !["roleHub", "roleKind"].includes(viewer.fmKey))
                            && viewer.getEditBox()
                        }
                    </div>
                ))}
            </FmEditBox>
        </>)
    }
    protected _getTopSectionDefault(): ReactNode {
        return (<>
            {super.getTopSection()}
            <div style={{ margin: "3px" }}>
                <MyNoteTopSection
                    viewer={this}
                />
            </div>
            <h1>Note</h1>
        </>)
    }
    protected _getTopSectionIndex(): ReactNode {
        return (<>
            <div style={{ margin: "3px" }}>
                <AspectIndexTopSection
                    viewer={this}
                />
            </div>
            <hr />
        </>)
    }
}