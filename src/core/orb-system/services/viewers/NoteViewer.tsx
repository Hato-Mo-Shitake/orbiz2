import { Fragment, ReactNode } from "react";
import { BaseNote } from "src/core/domain/Note";
import { OpenFmDisplayButton } from "src/looks/components/common-orbiz/OpenFmDisplayButton";
import { OpenFmEditButton } from "src/looks/components/common-orbiz/OpenFmEditButton";
import { OpenMainMenuButton } from "src/looks/components/common-orbiz/OpenMainMenuButton";
import { DateDisplay } from "src/looks/components/common/DateDisplay";
import { FmAttrViewer } from "src/orbits/contracts/fmAttr";
import { BaseFm } from "src/orbits/schema/frontmatters/fm";
import { BaseNoteState } from "src/orbits/schema/NoteState";
import { StoreApi } from "zustand";
import { BaseFmOrb } from "../../orbs/FmOrb";
import { BaseNoteEditor } from "../editors/NoteEditor";
import { BaseNoteReader } from "../readers/NoteReader";

export abstract class BaseNoteViewer<
    TFm extends BaseFm = BaseFm,
    TReader extends BaseNoteReader<TFm> = BaseNoteReader<TFm>,
    TEditor extends BaseNoteEditor<TFm> = BaseNoteEditor<TFm>,
> {
    public readonly fmViewers: FmAttrViewer[] = [];
    constructor(
        public readonly note: BaseNote<TFm>,
        public readonly fmOrb: BaseFmOrb,
        public readonly reader: TReader,
        public readonly editor: TEditor,
        public readonly store: StoreApi<BaseNoteState>,
    ) {
        Object.values(fmOrb).forEach((viewer: FmAttrViewer) => {
            this.fmViewers.push(viewer);
        })
    }

    getFmAttrs(): ReactNode {
        return (<>
            {this.fmViewers.map(v => {
                if (!v.getView) return;
                return (<Fragment key={v.fmKey}>
                    {v.getView()}
                </Fragment>)
            })}
            {/* {this.fmOrb.id.getView()}
            {this.fmOrb.type.getView()}
            {this.fmOrb.tags.getView()} */}
        </>)
    }

    getFmAttrsEditor(): ReactNode {
        return (<>
            {this.fmViewers.map(v => {
                if (v.isImmutable || !v.getEditableView) return;

                return (<Fragment key={v.fmKey}>
                    {v.getEditableView()}
                </Fragment>)
            })}
        </>)
    }

    getTopSection(): ReactNode {
        return (<>
            <div
                style={{ margin: "0.8em", display: "flex", gap: "1em" }}
            >
                <OpenMainMenuButton />
                <OpenFmDisplayButton
                    viewer={this}
                />
                <OpenFmEditButton
                    viewer={this}
                />
            </div>
            <div
                style={{ marginTop: "0.9em", display: "flex", gap: "0.3em" }}
            >
                <span>
                    c:
                    <DateDisplay date={this.note.created} />
                </span>
                <span>{"|"}</span>
                <span>
                    m:
                    <DateDisplay date={this.note.modified} />
                </span>
            </div>
        </>)
    }

    // getFmLooks(): ReactNode {
    //     return (
    //         <ul>
    //             {this.fmViewers.map(viewer => (
    //                 <li key={viewer.fmKey}>
    //                     {viewer.getLooks()}
    //                 </li>
    //             ))}
    //         </ul>
    //     );
    // }

    // getFmEditBox(): ReactNode {
    //     return (<>
    //         <FmEditBox editor={this.editor} >
    //             {this.fmViewers.map(viewer => (
    //                 <div key={viewer.fmKey}>
    //                     {!viewer.isImmutable && viewer.getEditBox()}
    //                 </div>
    //             ))}
    //         </FmEditBox>
    //     </>)
    // }
}
