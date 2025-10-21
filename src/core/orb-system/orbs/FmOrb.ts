import { FmAttrIsClosed } from "src/core/orb-system/services/fm-attrs/FmAttrBoolean";
import { FmAttrDue, FmAttrResolved, FmAttrTheDay } from "src/core/orb-system/services/fm-attrs/FmAttrDate";
import { FmAttrAmountSpent, FmAttrRank, FmAttrScore } from "src/core/orb-system/services/fm-attrs/FmAttrNumber";
import { FmAttrAspect, FmAttrContext, FmAttrDiaryNoteType, FmAttrId, FmAttrLogNoteType, FmAttrMyNoteType, FmAttrRoleKind, FmAttrStatus, FmAttrType } from "src/core/orb-system/services/fm-attrs/FmAttrString";
import { FmAttrAliases, FmAttrCategories, FmAttrTags, FmAttrTemplateDone } from "src/core/orb-system/services/fm-attrs/FmAttrStringList";
import { StdNoteType } from "../../../orbits/schema/frontmatters/NoteType";
import { FmAttr } from "../services/fm-attrs/FmAttr";
import { FmAttrRoleHub } from "../services/fm-attrs/FmAttrLinkedNote";
import { FmAttrBelongsTo, FmAttrCreatedNotes, FmAttrModifiedNotes, FmAttrReferences, FmAttrRelatesTo, FmAttrResolvedNotes } from "../services/fm-attrs/FmAttrLinkedNoteList";

export abstract class BaseFmOrb {
    public readonly attrs: FmAttr[] = [];
    constructor(
        public readonly type: FmAttrType,
        public readonly id: FmAttrId,
        public readonly tags: FmAttrTags,
    ) {
        Object.values(this).forEach((attr: FmAttr) => {
            this.attrs.push(attr);
        })
    }
}

export abstract class StdFmOrb extends BaseFmOrb {
    constructor(
        type: FmAttrType<StdNoteType>,
        id: FmAttrId,
        tags: FmAttrTags,
        public readonly subType: FmAttrMyNoteType | FmAttrLogNoteType,
        public readonly belongsTo: FmAttrBelongsTo,
        public readonly relatesTo: FmAttrRelatesTo,
        public readonly references: FmAttrReferences
    ) {
        super(
            type,
            id,
            tags,
        );
    }
}

export class MyFmOrb extends StdFmOrb {
    constructor(
        type: FmAttrType<"myNote">,
        id: FmAttrId,
        tags: FmAttrTags,
        // subType: FmAttrSubType<MyNoteType>,
        public readonly subType: FmAttrMyNoteType,
        belongsTo: FmAttrBelongsTo,
        relatesTo: FmAttrRelatesTo,
        references: FmAttrReferences,
        public readonly rank: FmAttrRank,
        public readonly aspect: FmAttrAspect,
        public readonly aliases: FmAttrAliases,
        public readonly categories: FmAttrCategories,
        public readonly roleKind: FmAttrRoleKind,
        public readonly roleHub: FmAttrRoleHub,
    ) {
        super(
            type,
            id,
            tags,
            subType,
            belongsTo,
            relatesTo,
            references,
        );
    }
}

export class LogFmOrb extends StdFmOrb {
    constructor(
        type: FmAttrType<"logNote">,
        id: FmAttrId,
        tags: FmAttrTags,
        public readonly subType: FmAttrLogNoteType,
        belongsTo: FmAttrBelongsTo,
        relatesTo: FmAttrRelatesTo,
        references: FmAttrReferences,
        public readonly status: FmAttrStatus,
        public readonly due: FmAttrDue,
        public readonly resolved: FmAttrResolved,
        public readonly context: FmAttrContext
    ) {
        super(
            type,
            id,
            tags,
            subType,
            belongsTo,
            relatesTo,
            references,
        );
    }
}

export abstract class DiaryFmOrb extends BaseFmOrb {
    constructor(
        type: FmAttrType<StdNoteType>,
        id: FmAttrId,
        tags: FmAttrTags,
        public readonly subType: FmAttrDiaryNoteType,
        public readonly score: FmAttrScore,
        public readonly isClosed: FmAttrIsClosed,
    ) {
        super(
            type,
            id,
            tags,
        );
    }
}

export class DailyFmOrb extends DiaryFmOrb {
    constructor(
        type: FmAttrType<StdNoteType>,
        id: FmAttrId,
        tags: FmAttrTags,
        // subType: FmAttrSubType<"daily">,
        readonly subType: FmAttrDiaryNoteType<"daily">,
        score: FmAttrScore,
        isClosed: FmAttrIsClosed,
        readonly theDay: FmAttrTheDay,
        readonly createdNotes: FmAttrCreatedNotes,
        readonly modifiedNotes: FmAttrModifiedNotes,
        readonly resolvedNotes: FmAttrResolvedNotes,
        readonly amountSpent: FmAttrAmountSpent,
        readonly templateDone: FmAttrTemplateDone,
    ) {
        super(
            type,
            id,
            tags,
            subType,
            score,
            isClosed
        );
    }
}