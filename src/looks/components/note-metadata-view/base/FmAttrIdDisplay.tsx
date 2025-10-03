import { FmAttrId } from "src/core/orb-system/services/fm-attrs/FmAttrString";

export function
    FmAttrIdDisplay({
        fmAttr,
        header = "id"
    }: {
        fmAttr: FmAttrId
        header?: string,
    }) {
    return (<>
        <div>
            {header && <span>{header}: </span>}
            {fmAttr.value}
        </div>
    </>)
}