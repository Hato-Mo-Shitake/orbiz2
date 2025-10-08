import { MyNoteViewer } from "src/core/orb-system/services/viewers/MyNoteViewer";
import { CreateLogNoteButton } from "src/looks/components/common-orbiz/CreateLogNoteButton";
import { CreateMyNoteButton } from "src/looks/components/common-orbiz/CreateMyNoteButton";
import { CreateRoleNodeButton } from "src/looks/components/common-orbiz/CreateRoleNodeButton";
import { StdNoteTopSectionHeader } from "../std-common/header";

export function MyNoteTopSectionDefault({ viewer }: { viewer: MyNoteViewer }) {
    return (<>
        <div>
            <StdNoteTopSectionHeader
                viewer={viewer}
            />
        </div>
        <div style={{ marginTop: "0.9em", display: "flex", alignItems: "center", gap: "0.2em" }}>
            create:
            <div style={{ display: "flex", alignItems: "center", gap: "0.0em" }}>
                <CreateMyNoteButton rootNote={viewer.note} label="my" />
                <div>
                    <span>（</span>
                    <CreateRoleNodeButton rootNote={viewer.note} label="role-node" />
                    <span>）</span>
                </div>
            </div>
            <CreateLogNoteButton rootNote={viewer.note} label="log" />
        </div >
        <div style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>
            <hr />
        </div>
        {viewer.fmOrb.tags.getView()}
        {viewer.fmOrb.categories.getView()}
        <div style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>
            <hr />
        </div>
        {viewer.getLinkedStdNoteList()}
        {Boolean(viewer.fmOrb.roleHub.value) && <>
            <h4>Role Hub</h4>
            {viewer.fmOrb.roleHub.getView()}
        </>}
        {Boolean(viewer.reader.getRoleNodeIds().length) && <>
            {viewer.getRoleNodes()}
        </>}
        <h1>Note</h1>
    </>)
}