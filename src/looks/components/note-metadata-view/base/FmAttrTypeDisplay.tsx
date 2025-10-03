import { FmAttrType } from "src/core/orb-system/services/fm-attrs/FmAttrString";

export function FmAttrTypeDisplay({
    fmAttr,
    header = "type"
}: {
    fmAttr: FmAttrType
    header?: string,
}) {
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {fmAttr.value}
        </div>
    </>)
}