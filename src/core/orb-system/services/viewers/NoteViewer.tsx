import { Fragment, ReactNode } from "react";
import { BaseNote } from "src/core/domain/Note";
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
                    <div style={{ marginTop: "0.6rem" }}>
                        {v.getView({ header: v.fmKey, headerWidth: 8 })}
                        {/* <hr /> */}
                    </div>
                </Fragment>)
            })}
        </>)
    }

    getFmAttrsEditor(): ReactNode {
        return (<>
            <p>{this.note.baseName}</p>
            {this.fmViewers.map(v => {
                if (v.isImmutable || !v.getEditableView) return;

                return (
                    <Fragment key={v.fmKey}>
                        {v.getEditableView()}
                        <hr />
                    </Fragment>
                )
            })}
        </>)
    }

    getFmAttrsForcedEditor(): ReactNode {
        return (<>
            <p>{this.note.baseName}</p>
            {this.fmViewers.map(v => {
                if (!v.isImmutable || !v.getForcedEditableView) return;

                return (
                    <Fragment key={v.fmKey}>
                        {v.getForcedEditableView()}
                        <hr />
                    </Fragment>
                )
            })}
        </>)
    }

    abstract getTopSection(): ReactNode
}
