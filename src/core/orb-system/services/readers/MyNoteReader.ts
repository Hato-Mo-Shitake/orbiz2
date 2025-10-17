import { AM } from "src/app/AppManager";
import { extractNoteNameFromInternalLink } from "src/assistance/utils/link";
import { MyNote } from "src/core/domain/MyNote";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { FmKey } from "src/orbits/contracts/fmKey";
import { MyFm } from "src/orbits/schema/frontmatters/fm";
import { MyFmOrb } from "../../orbs/FmOrb";
import { StdNoteReader } from "./StdNoteReader";

export class MyNoteReader<TFm extends MyFm = MyFm> extends StdNoteReader<TFm> {
    static getRoleNodeNoteList(rootNote: MyNote, inLinkIds: string[]): MyNote[] {
        const targetIds: string[] = [];
        inLinkIds.forEach(id => {
            const source = AM.cache.getStdNoteSourceById(id);
            if (!source) return;

            const fm = AM.note.getFmCacheByPath(source.path);
            if (!fm) throw new UnexpectedError();

            const iLink = String(fm["roleHub"]);
            if (rootNote.baseName == extractNoteNameFromInternalLink(iLink)) {
                targetIds.push(id);
            }
        });

        return targetIds.map(id => AM.note.getMyNote({ noteId: id })!);
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