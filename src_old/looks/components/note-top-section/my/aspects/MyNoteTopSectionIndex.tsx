import { MyNoteViewer } from "src/core/orb-system/services/viewers/MyNoteViewer";

export function MyNoteTopSectionIndex({ viewer }: { viewer: MyNoteViewer }) {
    return (<>
        {/* <FoldingElement header="parent" hLevel={3}>
            {viewer.getOutLinkTree("belongsTo")}
        </FoldingElement>
        <div>
            <h2>Children</h2>
            {viewer.getInLinkTree("belongsTo")}
        </div>
        <div>
            <h2>Related Notes</h2>
            {viewer.getInLinkTree("relatesTo")}
        </div>
        <FoldingElement header="Others" hLevel={2}>
            <h3>relatesTo</h3>
            {viewer.getOutLinkTree("relatesTo")}
            <h3>referenced</h3>
            {viewer.getInLinkTree("references")}
            <h3>references</h3>
            {viewer.getOutLinkTree("references")}
        </FoldingElement> */}
    </>);
}