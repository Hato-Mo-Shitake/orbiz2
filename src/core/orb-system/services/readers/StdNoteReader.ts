import { AM } from "src/app/AppManager";
import { extractNoteNameFromInternalLink } from "src/assistance/utils/link";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { StdNote } from "src/core/domain/StdNote";
import { StdFmOrb } from "src/core/orb-system/orbs/FmOrb";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { LinkedNoteDirection } from "src/orbits/contracts/create-note";
import { FmKey } from "src/orbits/contracts/fmKey";
import { RecursiveTree } from "src/orbits/contracts/tree";
import { StdFm } from "src/orbits/schema/frontmatters/fm";
import { BaseNoteReader } from "./NoteReader";

export abstract class StdNoteReader<TFm extends StdFm = StdFm> extends BaseNoteReader<TFm> {
    static getInLinkedNoteList(rootNote: StdNote, fmKey: FmKey<"stdLinkedNoteList">, inLinkIds: string[]): StdNote[] {
        const targetIds: string[] = [];
        inLinkIds.forEach(id => {
            const source = AM.cache.getStdNoteSourceById(id);
            if (!source) return;

            const fm = AM.note.getFmCacheByPath(source.path);
            if (!fm) throw new UnexpectedError();

            const iLinks = fm[fmKey];

            if (!Array.isArray(iLinks)) return;
            iLinks.forEach(iLink => {
                if (rootNote.baseName == extractNoteNameFromInternalLink(iLink)) {
                    targetIds.push(id);
                }
            });
        });

        return targetIds.map(id => AM.note.getStdNote({ noteId: id })!);
    }
    static getOutLinkedNoteList(rootNote: StdNote, fmKey: FmKey<"stdLinkedNoteList">, outLinkIds: string[]): StdNote[] {
        const targetIds: string[] = [];
        outLinkIds.forEach(id => {
            const source = AM.cache.getStdNoteSourceById(id);
            if (!source) return;


            const targetNoteName = getBasenameFromPath(source.path);
            const iLinks = rootNote.fmCache[fmKey]
            if (!Array.isArray(iLinks)) return;
            if (
                iLinks.some(iLink => targetNoteName == extractNoteNameFromInternalLink(iLink))
            ) {
                targetIds.push(id);
            }
        });

        return targetIds.map(id => AM.note.getStdNote({ noteId: id })!);
    }

    static buildRecursiveStdNoteTree(
        rootNoteId: string,
        key: FmKey<"stdLinkedNoteList">,
        direction: LinkedNoteDirection
    ): RecursiveTree<StdNote> {
        const build = (id: string, chain: Set<string>): RecursiveTree<StdNote> => {
            if (chain.has(id)) {
                console.warn(`循環参照を検出: ${id}`);
                return { hub: AM.note.getStdNote({ noteId: id })!, nodes: [] };
            }

            const source = AM.cache.getStdNoteSourceById(id);
            if (!source) return { hub: AM.note.getStdNote({ noteId: id })!, nodes: [] };

            const fm = AM.note.getFmCacheByPath(source.path);
            if (!fm) return { hub: AM.note.getStdNote({ noteId: id })!, nodes: [] };

            const nextChain = new Set(chain);
            nextChain.add(id);

            let nextIds: string[] = [];

            if (direction == "out") {
                const iLinks = fm[key];
                if (Array.isArray(iLinks)) {
                    nextIds = iLinks.flatMap(link => {
                        const name = extractNoteNameFromInternalLink(link);
                        return name ? (AM.cache.getStdNoteIdByName(name) ?? []) : [];
                    });
                }
            } else {
                const thisName = getBasenameFromPath(source.path);

                nextIds = [...source.inLinkIds].flatMap(otherId => {
                    const otherSource = AM.cache.getStdNoteSourceById(otherId);
                    if (!otherSource) return [];

                    const otherFm = AM.note.getFmCacheByPath(otherSource.path);
                    if (!otherFm) return [];

                    const iLinks = otherFm[key];
                    if (!Array.isArray(iLinks)) return [];

                    const hasLink = iLinks.some(link => {
                        const name = extractNoteNameFromInternalLink(link);
                        return name && name == thisName;
                    });

                    return hasLink ? [otherId] : [];
                });
            }

            const nodes = nextIds.map(nextId => build(nextId, nextChain));
            return { hub: AM.note.getStdNote({ noteId: id })!, nodes };
        };

        return build(rootNoteId, new Set());
        // return startIds.map(id => build(id, new Set()));
    }

    constructor(
        public readonly note: StdNote<TFm>,
        public readonly fmOrb: StdFmOrb,
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
        ];
    }

    getOutLinkIds(key: FmKey<"stdLinkedNoteList">): string[] {
        switch (key) {
            case ("belongsTo"):
                return this.fmOrb[key].noteIds;
            case ("references"):
                return this.fmOrb[key].noteIds;
            case ("relatesTo"):
                return this.fmOrb[key].noteIds;
            default:
                throw new UnexpectedError();
        }
    }

    getInLinkedNoteList(key: FmKey<"stdLinkedNoteList">): StdNote[] {
        return StdNoteReader.getInLinkedNoteList(this.note, key, [...this.note.source.inLinkIds]);
    }
    getInLinkIds(key: FmKey<"stdLinkedNoteList">): string[] {
        return this.getInLinkedNoteList(key).map(n => n.id);
    }

    getOutLinkedStdNoteTreeList(key: FmKey<"stdLinkedNoteList">): RecursiveTree<StdNote>[] {
        return this.fmOrb[key].value?.map(note => StdNoteReader.buildRecursiveStdNoteTree(note.id, key, "out"))
    }

    getInLinkedStdNoteTreeList(key: FmKey<"stdLinkedNoteList">): RecursiveTree<StdNote>[] {
        const inLinkedNoteList = this.getInLinkedNoteList(key);
        return inLinkedNoteList.map(note => StdNoteReader.buildRecursiveStdNoteTree(note.id, key, "in"));
    }
}