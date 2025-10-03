import { MyNoteViewer } from "src/core/orb-system/services/viewers/MyNoteViewer";

export function DisplayRole({
    viewer,
}: {
    viewer: MyNoteViewer,
}) {

    return (<>
        {viewer.reader.getRoleHubNoteId()
            ? <>
                <div>
                    {viewer.getRoleHub()
                        ? <>
                            <h4>RoleHub: {viewer.getRoleHub()}</h4>

                        </>
                        : ""
                    }
                </div>
            </>
            : <>
                <div>
                    {viewer.getRoleNodes()
                        ? <>
                            <h4>role nodes</h4>
                            {viewer.getRoleNodes()}
                        </>
                        : ""
                    }
                </div>
            </>

        }
    </>)
}