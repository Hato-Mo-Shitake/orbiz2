import { extractNoteNameFromInternalLink } from "src/assistance/utils/link";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { StdNote } from "src/core/domain/StdNote";
import { StdFmOrb } from "src/core/orb-system/orbs/FmOrb";
import { FmKey } from "src/orbits/contracts/fmKey";
import { RecursiveTree } from "src/orbits/contracts/tree";
import { StdFm } from "src/orbits/schema/frontmatters/fm";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { BaseNoteReader } from "./NoteReader";


export abstract class StdNoteReader<TFm extends StdFm = StdFm> extends BaseNoteReader<TFm> {
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
                throw OEM.throwUnexpectedError();
        }
    }

    getInLinkIds(key: FmKey<"stdLinkedNoteList">): string[] {
        const results: string[] = [];
        // const sources = OCM().noteSources;
        const thisNoteName = this.note.baseName;
        this.note.source.inLinkIds.forEach(id => {
            const source = OCM().getStdNoteSourceById(id);
            if (!source) throw new Error("sourceがない: getInLinkIds()")

            const fm = ONM().getFmCacheByPath(source.path);
            if (!fm) throw new Error("fm cacheがない: getInLinkIds()")

            const iLinks = fm[key];
            if (Array.isArray(iLinks)) {
                iLinks.forEach(iLink => {
                    if (thisNoteName == extractNoteNameFromInternalLink(iLink)) {
                        results.push(id);
                    }
                });
            }
        });

        return results;
    }

    getOutLinkTree(key: FmKey<"stdLinkedNoteList">): RecursiveTree<string>[] {
        return this.buildRecursiveTree(this.getOutLinkIds(key), key, true);
    }

    getInLinkTree(key: FmKey<"stdLinkedNoteList">): RecursiveTree<string>[] {
        const inLinkIds = this.getInLinkIds(key);
        return this.buildRecursiveTree(inLinkIds, key, false);
    }

    private buildRecursiveTree(
        startIds: string[],
        key: FmKey<"stdLinkedNoteList">,
        isParentSearch: boolean
    ): RecursiveTree<string>[] {
        const build = (id: string, chain: Set<string>): RecursiveTree<string> => {
            if (chain.has(id)) {
                console.warn(`循環参照を検出: ${id}`);
                return { hub: id, nodes: [] };
            }

            const source = OCM().getStdNoteSourceById(id);
            if (!source) return { hub: id, nodes: [] };

            const fm = ONM().getFmCacheByPath(source.path);
            if (!fm) return { hub: id, nodes: [] };

            const nextChain = new Set(chain);
            nextChain.add(id);

            let nextIds: string[] = [];

            if (isParentSearch) {
                const iLinks = fm[key];
                if (Array.isArray(iLinks)) {
                    nextIds = iLinks.flatMap(link => {
                        const name = extractNoteNameFromInternalLink(link);
                        return name ? (OCM().getStdNoteIdByName(name) ?? []) : [];
                    });
                }
            } else {
                const thisName = getBasenameFromPath(source.path);

                nextIds = [...source.inLinkIds].flatMap(otherId => {
                    const otherSource = OCM().getStdNoteSourceById(otherId);
                    if (!otherSource) return [];

                    const otherFm = ONM().getFmCacheByPath(otherSource.path);
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
            return { hub: id, nodes };
        };

        return startIds.map(id => build(id, new Set()));
    }
}