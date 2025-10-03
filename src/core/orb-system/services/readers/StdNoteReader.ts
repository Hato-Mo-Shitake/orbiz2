import { extractNoteNameFromInternalLink } from "src/assistance/utils/link";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { StdNote } from "src/core/domain/StdNote";
import { StdFmOrb } from "src/core/orb-system/orbs/FmOrb";
import { LinkedNoteDirection } from "src/orbits/contracts/create-note";
import { FmKey } from "src/orbits/contracts/fmKey";
import { RecursiveTree } from "src/orbits/contracts/tree";
import { StdFm } from "src/orbits/schema/frontmatters/fm";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { BaseNoteReader } from "./NoteReader";

export abstract class StdNoteReader<TFm extends StdFm = StdFm> extends BaseNoteReader<TFm> {
    static getInLinkedNoteList(rootNote: StdNote, fmKey: FmKey<"stdLinkedNoteList">, inLinkIds: string[]): StdNote[] {
        const targetIds: string[] = [];
        inLinkIds.forEach(id => {
            const source = OCM().getStdNoteSourceById(id);
            if (!source) return;

            const fm = ONM().getFmCacheByPath(source.path);
            if (!fm) OEM.throwUnexpectedError();

            const iLinks = fm[fmKey];

            if (!Array.isArray(iLinks)) return;
            iLinks.forEach(iLink => {
                if (rootNote.baseName == extractNoteNameFromInternalLink(iLink)) {
                    targetIds.push(id);
                }
            });
        });

        return targetIds.map(id => ONM().getStdNote({ noteId: id })!);
    }
    static getOutLinkedNoteList(rootNote: StdNote, fmKey: FmKey<"stdLinkedNoteList">, outLinkIds: string[]): StdNote[] {
        const targetIds: string[] = [];
        outLinkIds.forEach(id => {
            const source = OCM().getStdNoteSourceById(id);
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

        return targetIds.map(id => ONM().getStdNote({ noteId: id })!);
    }

    static buildRecursiveStdNoteTree(
        rootNoteId: string,
        key: FmKey<"stdLinkedNoteList">,
        direction: LinkedNoteDirection
    ): RecursiveTree<StdNote> {
        const build = (id: string, chain: Set<string>): RecursiveTree<StdNote> => {
            if (chain.has(id)) {
                console.warn(`循環参照を検出: ${id}`);
                return { hub: ONM().getStdNote({ noteId: id })!, nodes: [] };
            }

            const source = OCM().getStdNoteSourceById(id);
            if (!source) return { hub: ONM().getStdNote({ noteId: id })!, nodes: [] };

            const fm = ONM().getFmCacheByPath(source.path);
            if (!fm) return { hub: ONM().getStdNote({ noteId: id })!, nodes: [] };

            const nextChain = new Set(chain);
            nextChain.add(id);

            let nextIds: string[] = [];

            if (direction == "out") {
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
            return { hub: ONM().getStdNote({ noteId: id })!, nodes };
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
                throw OEM.throwUnexpectedError();
        }
    }

    getInLinkedNoteList(key: FmKey<"stdLinkedNoteList">): StdNote[] {
        return StdNoteReader.getInLinkedNoteList(this.note, key, [...this.note.source.inLinkIds]);
    }
    getInLinkIds(key: FmKey<"stdLinkedNoteList">): string[] {
        return this.getInLinkedNoteList(key).map(n => n.id);
    }
    // getInLinkIds(key: FmKey<"stdLinkedNoteList">): string[] {
    //     const results: string[] = [];
    //     // const sources = OCM().noteSources;
    //     const thisNoteName = this.note.baseName;
    //     this.note.source.inLinkIds.forEach(id => {
    //         const source = OCM().getStdNoteSourceById(id);
    //         if (!source) throw new Error("sourceがない: getInLinkIds()")

    //         const fm = ONM().getFmCacheByPath(source.path);
    //         if (!fm) throw new Error("fm cacheがない: getInLinkIds()")

    //         const iLinks = fm[key];
    //         if (Array.isArray(iLinks)) {
    //             iLinks.forEach(iLink => {
    //                 if (thisNoteName == extractNoteNameFromInternalLink(iLink)) {
    //                     results.push(id);
    //                 }
    //             });
    //         }
    //     });

    //     return results;
    // }

    getOutLinkedStdNoteTreeList(key: FmKey<"stdLinkedNoteList">): RecursiveTree<StdNote>[] {
        // return startIds.map(id => build(id, new Set()));
        return this.fmOrb[key].value?.map(note => StdNoteReader.buildRecursiveStdNoteTree(note.id, key, "out"))

        // StdNoteReader.buildRecursiveTree(this.getOutLinkIds(key), key, true);
    }

    getInLinkedStdNoteTreeList(key: FmKey<"stdLinkedNoteList">): RecursiveTree<StdNote>[] {
        const inLinkedNoteList = this.getInLinkedNoteList(key);
        return inLinkedNoteList.map(note => StdNoteReader.buildRecursiveStdNoteTree(note.id, key, "in"));
        // return StdNoteReader.buildRecursiveTree(inLinkIds, key, false);
    }

    // このロジックをstaticに切り分けて、Viewerのフックと共有する。
    // というか、最新を保つことを念頭に置くなら、Readerもstore基準で値を読み取るべきなような。
    // で、store基準で値を構成する。リロードのタイミングはEditorやキャッシュ更新時に指示。
    // private buildRecursiveTree(
    //     startIds: string[],
    //     key: FmKey<"stdLinkedNoteList">,
    //     isParentSearch: boolean
    // ): RecursiveTree<string>[] {
    //     const build = (id: string, chain: Set<string>): RecursiveTree<string> => {
    //         if (chain.has(id)) {
    //             console.warn(`循環参照を検出: ${id}`);
    //             return { hub: id, nodes: [] };
    //         }

    //         const source = OCM().getStdNoteSourceById(id);
    //         if (!source) return { hub: id, nodes: [] };

    //         const fm = ONM().getFmCacheByPath(source.path);
    //         if (!fm) return { hub: id, nodes: [] };

    //         const nextChain = new Set(chain);
    //         nextChain.add(id);

    //         let nextIds: string[] = [];

    //         if (isParentSearch) {
    //             const iLinks = fm[key];
    //             if (Array.isArray(iLinks)) {
    //                 nextIds = iLinks.flatMap(link => {
    //                     const name = extractNoteNameFromInternalLink(link);
    //                     return name ? (OCM().getStdNoteIdByName(name) ?? []) : [];
    //                 });
    //             }
    //         } else {
    //             const thisName = getBasenameFromPath(source.path);

    //             nextIds = [...source.inLinkIds].flatMap(otherId => {
    //                 const otherSource = OCM().getStdNoteSourceById(otherId);
    //                 if (!otherSource) return [];

    //                 const otherFm = ONM().getFmCacheByPath(otherSource.path);
    //                 if (!otherFm) return [];

    //                 const iLinks = otherFm[key];
    //                 if (!Array.isArray(iLinks)) return [];

    //                 const hasLink = iLinks.some(link => {
    //                     const name = extractNoteNameFromInternalLink(link);
    //                     return name && name == thisName;
    //                 });

    //                 return hasLink ? [otherId] : [];
    //             });
    //         }

    //         const nodes = nextIds.map(nextId => build(nextId, nextChain));
    //         return { hub: id, nodes };
    //     };

    //     return startIds.map(id => build(id, new Set()));
    // }
}