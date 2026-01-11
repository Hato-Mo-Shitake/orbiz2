import { FmAttrId } from "src/core/orb-system/services/fm-attrs/FmAttrString";
import { SimpleViewBox } from "../../common/SimpleViewBox";

export function
    FmAttrIdDisplay({
        fmAttr,
        header = "",
        headerWidth,
    }: {
        fmAttr: FmAttrId
        header?: string,
        headerWidth?: number
    }) {
    return (<>
        <SimpleViewBox header={header} headerWidth={headerWidth}>
            {fmAttr.value}
        </SimpleViewBox>
    </>)
}