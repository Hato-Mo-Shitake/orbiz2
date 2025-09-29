import { StdNoteViewer } from "src/core/orb-system/services/viewers/StdNoteViewer";
import { FmKey } from "src/orbits/contracts/fmKey";

export function DisplayStdLinkedNotes({
    viewer,
    options
}: {
    viewer: StdNoteViewer,
    options?: { isTree: boolean }
}) {
    const linkList: { outLinkLabel: string, inLinkLabel: string, key: FmKey<"stdLinkedNoteList"> }[] = [
        { outLinkLabel: "parent", inLinkLabel: "children", key: "belongsTo" },
        { outLinkLabel: "relate notes", inLinkLabel: "related notes", key: "relatesTo" },
        { outLinkLabel: "references", inLinkLabel: "referenced notes", key: "references" }
    ];

    return (<>
        {linkList.map(item => (
            <div key={`${viewer.note.id}-${item.key}`}>
                <div>
                    {options?.isTree
                        ? viewer.getOutLinkTree(item.key)
                            ? <>
                                <div>{item.outLinkLabel}: </div>
                                <div>
                                    {viewer.getOutLinkTree(item.key)}
                                </div>
                            </>
                            : null
                        : viewer.getOutLinks(item.key)
                            ? <>
                                <div>{item.outLinkLabel}: </div>
                                <div>
                                    {viewer.getOutLinks(item.key)}
                                </div>
                            </>
                            : null
                    }
                </div>

                <div>
                    {options?.isTree
                        ? viewer.getInLinkTree(item.key)
                            ? <>
                                <div>{item.inLinkLabel}: </div>
                                <div>
                                    {viewer.getInLinkTree(item.key)}
                                </div>
                            </>
                            : <></>
                        : viewer.getInLinks(item.key)
                            ? <>
                                <div>{item.inLinkLabel}: </div>
                                <div>
                                    {viewer.getInLinks(item.key)}
                                </div>
                            </>
                            : <></>
                    }
                </div>
            </div>
        ))}
    </>)
}