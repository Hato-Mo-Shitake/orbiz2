import { TFile } from "obsidian";
import { AM } from "src/app/AppManager";

export class TFileSorter {
    static compareDueDesc(a: TFile, b: TFile) {
        return TFileSorter.compareDateTsDesc("due", a, b)
    }
    static compareDueAsc(a: TFile, b: TFile) {
        return TFileSorter.compareDateTsAsc("due", a, b)
    }

    static compareTargetDateDesc(a: TFile, b: TFile) {
        return TFileSorter.compareDateTsDesc("targetDate", a, b)
    }
    static compareTargetDateAsc(a: TFile, b: TFile) {
        return TFileSorter.compareDateTsAsc("targetDate", a, b)
    }

    private static compareDateTsDesc(key: string, a: TFile, b: TFile) {
        const [aFm, bFm] = TFileSorter.getABFmCache(a, b);
        const aTs = aFm?.[key];
        const bTs = bFm?.[key];

        if (!aTs && !bTs) return 0;
        if (aTs && !bTs) return -1;
        if (!aTs && bTs) return 1;
        return Number(bTs) - Number(aTs);
    }
    private static compareDateTsAsc(key: string, a: TFile, b: TFile) {
        const [aFm, bFm] = TFileSorter.getABFmCache(a, b);
        const aTs = aFm?.[key];
        const bTs = bFm?.[key];

        if (!aTs && !bTs) return 0;
        if (aTs && !bTs) return -1;
        if (!aTs && bTs) return 1;
        return Number(aTs) - Number(bTs);
    }

    private static getABFmCache(a: TFile, b: TFile) {
        const aFmCache = AM.obsidian.metadataCache.getFileCache(a)?.frontmatter || null;
        const bFmCache = AM.obsidian.metadataCache.getFileCache(b)?.frontmatter || null;

        return [aFmCache, bFmCache]
    }
}