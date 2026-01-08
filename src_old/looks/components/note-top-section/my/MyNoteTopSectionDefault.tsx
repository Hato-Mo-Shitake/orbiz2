import { MyNoteViewer } from "src/core/orb-system/services/viewers/MyNoteViewer";
import { FoldingElement } from "../../common/FoldingElement";
import { StdNoteTopSectionHeader } from "../std-common/header";

export function MyNoteTopSectionDefault({ viewer }: { viewer: MyNoteViewer }) {
    return (<>
        <StdNoteTopSectionHeader
            viewer={viewer}
        />
        <hr />
        <div style={{ margin: "0.4rem 0" }}>
            {viewer.fmOrb.tags.getView({ header: "tags:", isHorizon: true })}
            {viewer.fmOrb.categories.getView({ header: "categories:", isHorizon: true })}
        </div>
        <hr />
        <div style={{ margin: "0.4rem 0" }} >
            {viewer.getLinkedStdNoteList()}
        </div>
        {Boolean(viewer.fmOrb.roleHub.value) && <>
            <h4>Role Hub</h4>
            <div style={{ marginLeft: "0.5rem" }}>
                {viewer.fmOrb.roleHub.getView()}
            </div>
        </>}
        {Boolean(viewer.reader.getRoleNodeIds().length) && <>
            <FoldingElement
                header="Role Nodes"
                hLevel={4}
                defaultOpen={true}
            >
                <div style={{ marginLeft: "2.5rem" }}>
                    {viewer.getRoleNodes()}
                </div>
            </FoldingElement>
        </>}
        <h1>Note</h1>
    </>)
}