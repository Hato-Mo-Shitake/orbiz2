import { ReactNode } from "react";
import { BaseNote } from "src/core/domain/Note";
import { OpenFmEditButton } from "src/looks/components/common-orbiz/OpenFmEditButton";
import { OpenMainMenuButton } from "src/looks/components/common-orbiz/OpenMainMenuButton";
import { FmEditBox } from "src/looks/components/fm-edit/main/FmEditBox";
import { FmAttrViewer } from "src/orbits/contracts/fmAttr";
import { BaseFm } from "src/orbits/schema/frontmatters/fm";
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
    ) {
        Object.values(fmOrb).forEach((viewer: FmAttrViewer) => {
            this.fmViewers.push(viewer);
        })
    }

    getTopSection(): ReactNode {
        return (<>
            <div style={{ display: "flex", gap: "1em" }}>
                <OpenMainMenuButton />
                <OpenFmEditButton
                    viewer={this}
                />
            </div>
        </>)
    }

    getFmLooks(): ReactNode {
        return (
            <ul>
                {this.fmViewers.map(viewer => (
                    <li key={viewer.fmKey}>
                        {viewer.getLooks()}
                    </li>
                ))}
            </ul>
        );
    }

    getFmEditBox(): ReactNode {
        return (<>
            <FmEditBox editor={this.editor} >
                {this.fmViewers.map(viewer => (
                    <div key={viewer.fmKey}>
                        {!viewer.isImmutable && viewer.getEditBox()}
                    </div>
                ))}
            </FmEditBox>
        </>)
    }
}
