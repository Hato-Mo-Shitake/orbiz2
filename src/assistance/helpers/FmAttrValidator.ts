import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { extractLinkTarget } from "../utils/filter";
import { isHalfWidthNumber } from "../utils/validation";

export class FmAttrValidator {
    static tag(tag: string): boolean {
        return !isHalfWidthNumber(tag);
    }
    static internalLink(link: string): boolean {
        const path = extractLinkTarget(link);
        // console.log(path);
        if (!path) return false;
        // 名前オンリーのリンクだとここで落ちるんだ。
        return OAM().isVaultPath(path);
    }
}