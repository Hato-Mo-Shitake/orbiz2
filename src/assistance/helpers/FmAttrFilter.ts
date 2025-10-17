import { AM } from "src/app/AppManager";
import { sanitizeFileName } from "../utils/filter";
import { FmAttrValidator } from "./FmAttrValidator";

export class FmAttrFilter {
    static internalLink(link: string): string | null {
        if (FmAttrValidator.internalLink(link)) return link;

        if (AM.orbiz.isVaultPath(link)) return `[[${link}]]`;
        // if (OAM().isVaultPath(link)) return `[[${link}]]`;

        if (!link.includes("/")) {
            const noteId = AM.cache.getStdNoteIdByName(link);

            if (!noteId) return null;
            const source = AM.cache.getStdNoteSourceById(noteId);
            if (!source) return null;

            const parts = source.path.split("/");

            const filtered = parts.map(sanitizeFileName).join("/");

            return `[[${filtered}]]`;
        }
        return null;
    }
}