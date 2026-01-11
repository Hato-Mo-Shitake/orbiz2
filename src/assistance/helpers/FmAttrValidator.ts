import { AM } from "src/app/AppManager";
import { extractLinkTarget } from "../utils/filter";
import { isHalfWidthNumber } from "../utils/validation";

export class FmAttrValidator {
    static tag(tag: string): boolean {
        return !isHalfWidthNumber(tag);
    }
    static internalLink(link: string): boolean {
        const path = extractLinkTarget(link);
        if (!path) return false;
        // NOTE: 名前オンリーのリンクだとここで落ちる。
        return AM.orbiz.isVaultPath(path);
    }
}