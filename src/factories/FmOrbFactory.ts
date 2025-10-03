import { FrontMatterCache, TFile } from "obsidian";
import { isLiteral } from "src/assistance/utils/validation";
import { DailyFmOrb, LogFmOrb, MyFmOrb } from "src/core/orb-system/orbs/FmOrb";
import { FmAttrIsClosed } from "src/core/orb-system/services/fm-attrs/FmAttrBoolean";
import { FmAttrDue, FmAttrResolved, FmAttrTheDay } from "src/core/orb-system/services/fm-attrs/FmAttrDate";
import { FmAttrRoleHub } from "src/core/orb-system/services/fm-attrs/FmAttrLinkedNote";
import { FmAttrBelongsTo, FmAttrCreatedNotes, FmAttrModifiedNotes, FmAttrReferences, FmAttrRelatesTo, FmAttrResolvedNotes } from "src/core/orb-system/services/fm-attrs/FmAttrLinkedNoteList";

import { FmAttrAmountSpent, FmAttrRank, FmAttrScore } from "src/core/orb-system/services/fm-attrs/FmAttrNumber";
import { FmAttrAspect, FmAttrContext, FmAttrId, FmAttrRoleKind, FmAttrStatus, FmAttrSubType, FmAttrType } from "src/core/orb-system/services/fm-attrs/FmAttrString";
import { FmAttrAliases, FmAttrCategories, FmAttrTags, FmAttrTemplateDone } from "src/core/orb-system/services/fm-attrs/FmAttrStringList";
import { isMyNoteAspect, MyNoteAspect } from "src/orbits/schema/frontmatters/Aspect";
import { DailyFm, isDailyFm, isLogFm, isMyFm, LogFm, MyFm } from "src/orbits/schema/frontmatters/fm";
import { isLogNoteType, isMyNoteType, LogNoteType, MyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { isLogNoteStatus, LogNoteStatus } from "src/orbits/schema/frontmatters/Status";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class FmOrbFactory {
    forMy(tFile: TFile, options?: { fm?: MyFm }): MyFmOrb | null {
        let fm: MyFm;
        if (options?.fm) {
            fm = options.fm;
        } else {
            const fmCache: FrontMatterCache | undefined = OAM().app.metadataCache.getFileCache(tFile)?.frontmatter;
            if (!isMyFm(fmCache)) return null;
            fm = fmCache;
        }

        const type = fm["type"];
        if (!isLiteral(type, "myNote")) return null;

        const subType = fm["subType"];
        if (!isMyNoteType(subType)) return null;

        let aspect: MyNoteAspect;
        if (isMyNoteAspect(fm["aspect"])) {
            aspect = fm["aspect"];
        } else {
            aspect = "default";
        }

        const fmOrb = new MyFmOrb(
            new FmAttrType<"myNote">(tFile, type),
            new FmAttrId(tFile, fm["id"]),
            new FmAttrTags(tFile, fm["tags"]),
            new FmAttrSubType<MyNoteType>(tFile, subType),
            new FmAttrBelongsTo(tFile, fm["belongsTo"]),
            new FmAttrRelatesTo(tFile, fm["relatesTo"]),
            new FmAttrReferences(tFile, fm["references"]),
            new FmAttrRank(tFile, fm["rank"]),
            new FmAttrAspect(tFile, aspect),
            new FmAttrAliases(tFile, fm["aliases"]),
            new FmAttrCategories(tFile, fm["categories"]),
            new FmAttrRoleKind(tFile, fm["roleKind"]),
            new FmAttrRoleHub(tFile, fm["roleHub"]),
        );

        return fmOrb;
    }

    forLog(tFile: TFile, options?: { fm?: LogFm }): LogFmOrb | null {
        let fm: LogFm;
        if (options?.fm) {
            fm = options.fm;
        } else {
            const fmCache: FrontMatterCache | undefined = OAM().app.metadataCache.getFileCache(tFile)?.frontmatter;
            if (!isLogFm(fmCache)) return null;
            fm = fmCache;
        }

        const type = fm["type"];
        if (!isLiteral(type, "logNote")) return null;

        const subType = fm["subType"];
        if (!isLogNoteType(subType)) return null;

        let status: LogNoteStatus;
        if (isLogNoteStatus(fm["status"])) {
            status = fm["status"];
        } else {
            status = "default";
        }

        return new LogFmOrb(
            new FmAttrType<"logNote">(tFile, type),
            new FmAttrId(tFile, fm["id"]),
            new FmAttrTags(tFile, fm["tags"]),
            new FmAttrSubType<LogNoteType>(tFile, subType),
            new FmAttrBelongsTo(tFile, fm["belongsTo"]),
            new FmAttrRelatesTo(tFile, fm["relatesTo"]),
            new FmAttrReferences(tFile, fm["references"]),
            new FmAttrStatus(tFile, status),
            new FmAttrDue(tFile, fm["due"]),
            new FmAttrResolved(tFile, fm["resolved"]),
            new FmAttrContext(tFile, fm["context"]),
        );
    }

    forDaily(tFile: TFile, options?: { fm?: DailyFm }): DailyFmOrb | null {
        let fm: DailyFm;
        if (options?.fm) {
            fm = options.fm;
        } else {
            const fmCache: FrontMatterCache | undefined = OAM().app.metadataCache.getFileCache(tFile)?.frontmatter;
            if (!isDailyFm(fmCache)) return null;
            fm = fmCache;
        }

        const type = fm["type"];
        if (!isLiteral(type, "diaryNote")) return null;

        const subType = fm["subType"];
        if (!isLiteral(subType, "daily")) return null;

        return new DailyFmOrb(
            new FmAttrType<"diaryNote">(tFile, type),
            new FmAttrId(tFile, fm["id"]),
            new FmAttrTags(tFile, fm["tags"]),
            new FmAttrSubType<"daily">(tFile, subType),
            new FmAttrScore(tFile, fm["score"]),
            new FmAttrIsClosed(tFile, fm["isClosed"]),
            new FmAttrTheDay(tFile, fm["theDay"]),
            new FmAttrCreatedNotes(tFile, fm["createdNotes"]),
            new FmAttrModifiedNotes(tFile, fm["modifiedNotes"]),
            new FmAttrResolvedNotes(tFile, fm["resolvedNotes"]),
            new FmAttrAmountSpent(tFile, fm["amountSpent"]),
            new FmAttrTemplateDone(tFile, fm["templateDone"]),
        );
    }
}