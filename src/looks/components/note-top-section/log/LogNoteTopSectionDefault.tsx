import { LogNoteViewer } from "src/core/orb-system/services/viewers/LogNoteViewer";
import { StdNoteTopSectionHeader } from "../std-common/header";

export function LogNoteTopSectionDefault({ viewer }: { viewer: LogNoteViewer }) {
    return (<>
        <StdNoteTopSectionHeader
            viewer={viewer}
        />
        <hr />
        <div style={{ margin: "0.4rem 0" }}>
            {viewer.fmOrb.tags.getView({ header: "tags:", isHorizon: true })}
            {viewer.fmOrb.status.getView({ header: "status:" })}
            {viewer.fmOrb.due.getView({ header: "due:" })}
            {viewer.fmOrb.resolved.getView({ header: "resolved:" })}
            {viewer.fmOrb.context.getView({ header: "context:" })}

        </div>
        <hr />
        {viewer.getLinkedStdNoteList()}
        <h1>Note</h1>
    </>)
}