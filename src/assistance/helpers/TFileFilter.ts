import { TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { TFileSorter } from "./TFileSorter";

export class TFileFilter {
    static extractUnresolvedLogNote(tFiles: TFile[]) {
        return tFiles.filter(TFileFilter.forUnresolvedLogNote).sort(TFileSorter.compareDueAsc);
    }
    static forUnresolvedLogNote(tFile: TFile) {
        const fmCache = AM.obsidian.metadataCache.getFileCache(tFile)?.frontmatter;
        if (!fmCache) return false;
        if (fmCache["type"] != "logNote") return false;
        if (fmCache["resolved"]) return false;

        return true;
    }

    static extractInProgressMyNote(tFiles: TFile[]) {
        return tFiles.filter(TFileFilter.forInProgressMyNote).sort(TFileSorter.compareTargetDateAsc);
    }
    static forInProgressMyNote(tFile: TFile) {
        const fmCache = AM.obsidian.metadataCache.getFileCache(tFile)?.frontmatter;
        if (!fmCache) return false;
        if (fmCache["type"] != "myNote") return false;
        if (!fmCache["targetDate"]) return false;
        if (fmCache["done"]) return false;

        return true;
    }
}