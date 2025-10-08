import { extractNoteNameFromInternalLink } from "src/assistance/utils/link";
import { MyNote } from "src/core/domain/MyNote";
import { FmKey } from "src/orbits/contracts/fmKey";
import { MyFm } from "src/orbits/schema/frontmatters/fm";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { MyFmOrb } from "../../orbs/FmOrb";
import { StdNoteReader } from "./StdNoteReader";

export class MyNoteReader<TFm extends MyFm = MyFm> extends StdNoteReader<TFm> {
    static getRoleNodeNoteList(rootNote: MyNote, inLinkIds: string[]): MyNote[] {
        const targetIds: string[] = [];
        inLinkIds.forEach(id => {
            const source = OCM().getStdNoteSourceById(id);
            if (!source) return;

            const fm = ONM().getFmCacheByPath(source.path);
            if (!fm) OEM.throwUnexpectedError();

            const iLink = String(fm["roleHub"]);
            if (rootNote.baseName == extractNoteNameFromInternalLink(iLink)) {
                targetIds.push(id);
            }
        });

        return targetIds.map(id => ONM().getMyNote({ noteId: id })!);
    }

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
            ...this.fmOrb.belongsTo.noteIds,
            ...this.fmOrb.relatesTo.noteIds,
            ...this.fmOrb.references.noteIds,
            ...this.getInLinkIds("belongsTo"),
            ...this.getInLinkIds("references"),
            ...this.getInLinkIds("relatesTo"),
            ...(this.getRoleHubNoteId() || []),
            ...this.getRoleNodeIds()
        ];
    }

    getRoleHubNoteId(): string | null {
        return this.fmOrb.roleHub.value?.id || null;
    }

    getRoleNodeIds(): string[] {
        return MyNoteReader.getRoleNodeNoteList(this.note, [...this.note.source.inLinkIds]).map(n => n.id);
    }

    getInLinkIds(key: FmKey<"stdLinkedNoteList"> | FmKey<"roleHub">): string[] {
        if (key != "roleHub") {
            return super.getInLinkIds(key);
        }
        return this.getRoleNodeIds();
    }
}