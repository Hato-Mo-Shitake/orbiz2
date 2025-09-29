import { extractNoteNameFromInternalLink } from "src/assistance/utils/link";
import { MyNote } from "src/core/domain/MyNote";
import { FmKey } from "src/orbits/contracts/fmKey";
import { MyFm } from "src/orbits/schema/frontmatters/fm";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { MyFmOrb } from "../../orbs/FmOrb";
import { StdNoteReader } from "./StdNoteReader";

export class MyNoteReader<TFm extends MyFm = MyFm> extends StdNoteReader<TFm> {
    constructor(
        public readonly note: MyNote<TFm>,
        public readonly fmOrb: MyFmOrb,
    ) {
        super(
            note,
            fmOrb
        );
    }

    get linkedNoteIds(): string[] {
        return [
            ...this.fmOrb.roleHub.value?.id || [],
            ...this.fmOrb.belongsTo.noteIds,
            ...this.fmOrb.relatesTo.noteIds,
            ...this.fmOrb.references.noteIds,
            ...this.getInLinkIds("belongsTo"),
            ...this.getInLinkIds("references"),
            ...this.getInLinkIds("relatesTo"),
        ];
    }

    getRoleHubNoteId(): string | null {
        return this.fmOrb.roleHub.value?.id || null;
    }

    getInLinkIds(key: FmKey<"stdLinkedNoteList"> | FmKey<"roleHub">): string[] {
        if (key == "roleHub") {
            const results: string[] = [];
            const thisNoteName = this.note.baseName;
            this.note.source.inLinkIds.forEach(id => {
                const source = OCM().getStdNoteSourceById(id);
                if (!source) throw new Error("sourceがない: getInLinkIds()")

                const fm = ONM().getFmCacheByPath(source.path);
                if (!fm) throw new Error("fm cacheがない: getInLinkIds()")

                const iLink = fm["roleHub"];
                if (!iLink) return;
                if (thisNoteName == extractNoteNameFromInternalLink(iLink)) {
                    results.push(id);
                }
            });

            return results;
        } else {
            return super.getInLinkIds(key);
        }
    }
}