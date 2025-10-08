import { LogNoteViewer } from "src/core/orb-system/services/viewers/LogNoteViewer";
import { CreateLogNoteButton } from "../../common-orbiz/CreateLogNoteButton";
import { CreateMyNoteButton } from "../../common-orbiz/CreateMyNoteButton";
import { StdNoteTopSectionHeader } from "../std-common/header";

export function LogNoteTopSectionDefault({ viewer }: { viewer: LogNoteViewer }) {
    return (<>
        <div>
            <StdNoteTopSectionHeader
                viewer={viewer}
            />
        </div>
        < div style={{ marginTop: "0.9em", display: "flex", alignItems: "center", gap: "0.2em" }}>
            create:
            <CreateMyNoteButton rootNote={viewer.note} label="my" />
            <CreateLogNoteButton rootNote={viewer.note} label="log" />
        </div >
        <div style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>
            <hr />
        </div>
        {viewer.fmOrb.status.getView()}
        {viewer.fmOrb.due.getView()}
        {viewer.fmOrb.resolved.getView()}
        {viewer.fmOrb.context.getView()}
        <div style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>
            <hr />
        </div>
        {viewer.getLinkedStdNoteList()}
        <h1>Note</h1>
    </>)
}