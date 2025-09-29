import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { sanitizeFileName } from "../utils/filter";
import { FmAttrValidator } from "./FmAttrValidator";

export class FmAttrFilter {
    static internalLink(link: string): string | null {
        if (FmAttrValidator.internalLink(link)) return link;
        if (OAM().isVaultPath(link)) return `[[${link}]]`;
        if (!link.includes("/")) {

            // const map = OCM().fileNameToIdMap;
            // const noteId = map.get(link);
            const noteId = OCM().getStdNoteIdByName(link);

            if (!noteId) return null;
            const source = OCM().getStdNoteSourceById(noteId);
            if (!source) return null;

            const parts = source.path.split("/");

            const filtered = parts.map(sanitizeFileName).join("/");

            return `[[${filtered}]]`;
        }
        return null;
    }
}