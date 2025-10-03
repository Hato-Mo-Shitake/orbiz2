import { FmAttrSubType } from "src/core/orb-system/services/fm-attrs/FmAttrString";

export function FmAttrSubTypeDisplay({
    fmAttr,
    header = "subType"
}: {
    fmAttr: FmAttrSubType
    header?: string,
}) {
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {fmAttr.value}
        </div>
    </>)
}