import { FmAttrViewer } from "src/core/orb-system/services/fm-attrs/FmAttr";
import { useFmAttrViewer } from "src/looks/hooks/useFmAttrViewer";

export function DisplayFmAttr({
    fmAttrViewer
}: {
    fmAttrViewer: FmAttrViewer
}) {
    const { value } = useFmAttrViewer(fmAttrViewer);

    return (<>
        <div>{fmAttrViewer.label}: {String(value)}</div>
    </>)
}