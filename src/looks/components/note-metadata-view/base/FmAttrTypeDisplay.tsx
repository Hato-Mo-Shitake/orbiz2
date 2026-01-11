import { FmAttrType } from "src/core/orb-system/services/fm-attrs/FmAttrString";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function FmAttrTypeDisplay({
    fmAttr,
    header,
    headerWidth,
}: {
    fmAttr: FmAttrType
    header?: string,
    headerWidth?: number
}) {
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            <a>
                {fmAttr.value}
            </a>
        </SimpleViewBox>
    </>)
}