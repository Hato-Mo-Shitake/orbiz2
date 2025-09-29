import { CachedMetadata, debounce, FrontMatterCache, FrontmatterLinkCache, LinkCache, TFile } from "obsidian";
import { generateCurrentIsoDatetime } from "src/assistance/utils/date";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { DiaryNoteOrb, isDiaryNoteOrb, isStdNoteOrb, StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { PromptAddLinkedNoteModal } from "src/looks/modals/prompt/PromptAddLinkedNoteModal";
import { PromptNewLogNoteConfModal } from "src/looks/modals/prompt/PromptNewLogNoteConfModal";
import { PromptNewMyNoteConfModal } from "src/looks/modals/prompt/PromptNewMyNoteConfModal";
import { PromptSelectModal } from "src/looks/modals/prompt/PromptSelectModal";
import { isNewLogNoteConf, isNewMyNoteConf, NewStdNoteConf } from "src/orbits/contracts/create-note";
import { BaseFm } from "src/orbits/schema/frontmatters/fm";
import { FmValue } from "src/orbits/schema/frontmatters/FmKey";
import { StdNoteSource } from "src/orbits/schema/NoteSource";
import { OAM } from "./OrbizAppManager";
import { ODM } from "./OrbizDiaryManager";
import { OEM } from "./OrbizErrorManager";
import { OEwM } from "./OrbizEventWatchManager";
import { ONM } from "./OrbizNoteManager";
import { OOM } from "./OrbizOrbManager";
import { ORM } from "./OrbizRepositoryManager";
import { OTM } from "./OrbizTFileManager";
import { OUM } from "./OrbizUseCaseManager";
import { OVM } from "./OrbizViewManager";

export class OrbizCacheManager {
    private static _instance: OrbizCacheManager | null = null;

    static setInstance(): void {
        this._instance = new OrbizCacheManager();
    }

    static getInstance(): OrbizCacheManager {
        if (!this._instance) OEM.throwNotInitializedError(OrbizCacheManager);
        return this._instance;
    }

    /** ------------------------------------------------------------------- */

    /** id -> NoteSource */
    private _stdNoteSourceMapById = new Map<string, StdNoteSource>();

    // fileName -> noteId
    private _stdNoteIdMapByName = new Map<string, string>();

    // id -> NoteOrb
    private readonly _stdNoteOrbMapById = new Map<string, StdNoteOrb>();
    private readonly _diaryNoteOrbMapById = new Map<string, DiaryNoteOrb>();

    private constructor() { }

    hasNoteId(id: string): boolean {
        return this._stdNoteSourceMapById.has(id);
    }

    get stdNoteSources(): Map<string, StdNoteSource> {
        return this._stdNoteSourceMapById;
    }
    getStdNoteSourceById(id: string): StdNoteSource | null {
        return this._stdNoteSourceMapById.get(id) || null;
    }

    getStdNoteSourceByTFile(tFile: TFile): StdNoteSource | null {
        const id = ONM().getNoteIdByTFile(tFile);
        if (!id) {
            OEM.reportNoIdTFile(tFile);
            return null;
        }

        const source = this.getStdNoteSourceById(id);
        if (!source) {
            OEM.reportNothingSource(tFile.path);
            return null;
        }

        return source;
    }
    getStdNoteSourceByFm(fm: BaseFm): StdNoteSource | null {
        const id = fm.id;

        const source = this.getStdNoteSourceById(id);
        if (!source) {
            OEM.reportNothingSource(fm.id);
            return null;
        }

        return source;
    }
    setStdNoteSource(noteId: string, source: StdNoteSource) {
        this._stdNoteSourceMapById.set(noteId, source);
    }

    getStdNoteIdByName(name: string): string | null {
        return this._stdNoteIdMapByName.get(name) || null;
    }
    hasStdNoteName(name: string): boolean {
        return this._stdNoteIdMapByName.has(name);
    }
    setStdNoteIdByName(name: string, id: string) {
        this._stdNoteIdMapByName.set(name, id);
    }
    getAllStdNoteNames() {
        return [...this._stdNoteIdMapByName.keys()];
    }
    getStdNoteOrb(noteId: string): StdNoteOrb | null {
        return this._stdNoteOrbMapById.get(noteId) || null;
    }
    setStdNoteOrbCache(noteId: string, orb: StdNoteOrb) {
        this._stdNoteOrbMapById.set(noteId, orb);
    }
    getDiaryNoteOrb(noteId: string): DiaryNoteOrb | null {
        return this._diaryNoteOrbMapById.get(noteId) || null;
    }
    setDiaryNoteOrbCache(noteId: string, orb: DiaryNoteOrb) {
        this._diaryNoteOrbMapById.set(noteId, orb);
    }

    // getTFileByNoteId(id: string): TFile | null {
    //     const source = this.getStdNoteSourceById(id);
    //     if (!source) return null;
    //     const path = source.path;
    //     return OAM().app.vault.getFileByPath(path);
    // }


    // updateStdNoteOrbCaches(): void {
    //     // console.log("orbキャッシュ更新前", this._stdNoteOrbMapById);
    //     const aliveViews = OVM().aliveStdNoteView;
    //     const aliveNoteIds = new Set<string>();
    //     const cacheMap = this._stdNoteOrbMapById;

    //     aliveViews.forEach(view => {
    //         const orb = view.noteOrb;
    //         if (!orb) OEM.throwUnexpectedError();
    //         const noteId = orb.note.id;
    //         if (!cacheMap.has(noteId)) {
    //             cacheMap.set(noteId, orb);
    //         }

    //         aliveNoteIds.add(noteId);
    //     });

    //     for (const id of cacheMap.keys()) {
    //         if (!aliveNoteIds.has(id)) {
    //             // Note: 二回削除候補に上がったら消す的な。
    //             // 一旦これで、新規作成先のノートに、実在する親ノートがTopSectionに表示されない問題は解決したけど、まだ色々とTopSection表示周りは不安定な気がする。ルートノートの子ノート表示が、新規作成先のものしか表示されない時あるし。
    //             if (this._deletedCacheNoteIdList.has(id)) {
    //                 cacheMap.delete(id);
    //                 this._deletedCacheNoteIdList.delete(id);
    //             } else {
    //                 this._deletedCacheNoteIdList.add(id);
    //             }
    //         }
    //     }

    //     // console.log("orbキャッシュ更新後", this._stdNoteOrbMapById);
    // }



    // updateNoteOrbCaches = debounce(this._updateNoteOrbCaches, 3000, true);
    private readonly _deletedCacheNoteIdList = new Set<string>();
    updateNoteOrbCaches(): void {
        // console.log("orbキャッシュ更新前", this._stdNoteOrbMapById);
        const aliveViews = OVM().aliveOrbizMdView;
        const aliveNoteIds = new Set<string>();
        const stdCacheMap = this._stdNoteOrbMapById;
        const diaryCacheMap = this._diaryNoteOrbMapById;

        aliveViews.forEach(view => {
            const orb = view.noteOrb;

            if (!orb) OEM.throwUnexpectedError();
            const noteId = orb.note.id;

            if (isStdNoteOrb(orb)) {
                if (!stdCacheMap.has(noteId)) {
                    stdCacheMap.set(noteId, orb);
                }
            } else if (isDiaryNoteOrb(orb)) {
                if (!diaryCacheMap.has(noteId)) {
                    diaryCacheMap.set(noteId, orb);
                }
            } else {
                OEM.throwUnexpectedError();
            }

            aliveNoteIds.add(noteId);
        });

        for (const id of stdCacheMap.keys()) {
            if (!aliveNoteIds.has(id)) {
                // Note: 二回削除候補に上がったら消す的な。
                // 一旦これで、新規作成先のノートに、実在する親ノートがTopSectionに表示されない問題は解決したけど、まだ色々とTopSection表示周りは不安定な気がする。ルートノートの子ノート表示が、新規作成先のものしか表示されない時あるし。
                if (this._deletedCacheNoteIdList.has(id)) {
                    stdCacheMap.delete(id);
                    this._deletedCacheNoteIdList.delete(id);
                } else {
                    this._deletedCacheNoteIdList.add(id);
                }
            }
        }
        for (const id of diaryCacheMap.keys()) {
            if (this._deletedCacheNoteIdList.has(id)) {
                diaryCacheMap.delete(id);
                this._deletedCacheNoteIdList.delete(id);
            } else {
                this._deletedCacheNoteIdList.add(id);
            }
        }

        // console.log("orbキャッシュ更新後", this._stdNoteOrbMapById);
    }

    initialize(): void {
        console.log('cache initializing start.');
        const { app } = OAM();

        OTM().allStdTFiles.forEach(file => {
            const name = file.basename;

            const id = ONM().getNoteIdByTFile(file);
            if (!id) {
                OEM.reportMissingNoteId(file.path);
                return;
            }

            if (this._stdNoteSourceMapById.has(id)) {
                OEM.reportNoteIdConflict(id, file.path)
                return;
            }
            this._stdNoteSourceMapById.set(id, {
                id,
                path: file.path,
                outLinkIds: new Set<string>(),
                inLinkIds: new Set<string>(),
            });

            if (this._stdNoteIdMapByName.has(name)) {
                OEM.reportFileNameConflict(name, file.path);
                return;
            }

            this._stdNoteIdMapByName.set(name, id);
        });

        const resolvedLinks = app.metadataCache.resolvedLinks;
        for (const [sourcePath, targets] of Object.entries(resolvedLinks)) {
            if (!ONM().isStdNotePath(sourcePath)) continue;

            const noteId = ONM().getNoteIdByPath(sourcePath);
            if (!noteId) {
                console.error(`no id: ${sourcePath}`);
                continue;
            }

            const source = this.getStdNoteSourceById(noteId);
            if (!source) {
                console.error(`no source std note: ${sourcePath}`);
                continue
            };

            const outLinkIds: Set<string> = new Set<string>();
            for (const targetPath of Object.keys(targets)) {
                if (!ONM().isStdNotePath(sourcePath)) continue;
                const targetId = ONM().getNoteIdByPath(targetPath);
                if (!targetId) continue;

                outLinkIds.add(targetId);

                // inLinkIds の逆引きも追加
                const targetNote = this.getStdNoteSourceById(targetId);
                if (targetNote) targetNote.inLinkIds.add(noteId);

            }

            source.outLinkIds = outLinkIds;
        }

        console.log("cache initialized.");
    }

    private _prePathChangedId: string | null = null;
    updateCacheWhenPathChanged = (tFile: TFile, oldPath: string) => {
        console.log("updateCacheWhenPathChanged start.");
        if (tFile.extension !== "md") return;

        const path = tFile.path;
        if (!ONM().isStdNotePath(path)) return;

        const oldName = getBasenameFromPath(oldPath);
        const newName = getBasenameFromPath(tFile.path);
        if (oldName == newName) return;

        const id = this._stdNoteIdMapByName.get(oldName);
        if (!id) OEM.throwNoIdNote(tFile.path);

        if (!this._prePathChangedId || this._prePathChangedId === id) {
            this._debouncedUpdateCacheWhenPathChanged(tFile, oldName, newName, id);
        } else {
            this._prePathChangedId = id;
            this._updateCacheWhenPathChanged(tFile, oldName, newName, id);
        }
    }
    private _debouncedUpdateCacheWhenPathChanged = debounce(this._updateCacheWhenPathChanged, 1500, true);
    private _updateCacheWhenPathChanged(tFile: TFile, oldName: string, newName: string, id: string): void {
        const source = this.getStdNoteSourceByTFile(tFile);
        if (!source) return;
        // 更新
        source.path = tFile.path;

        //　更新
        this._stdNoteIdMapByName.delete(oldName);
        this._stdNoteIdMapByName.set(newName, id);

        // TODO: inLinks変更の感知が厳しいので、結局こうする。
        OVM().reloadStdNoteViews();
    }

    private _preMetadataChangedId: string | null = null;
    updateCacheWhenMetadataChanged = async (tFile: TFile, cache: CachedMetadata) => {
        console.log("updateCacheWhenMetadataChanged");

        const fmCache = cache?.frontmatter;
        if (!fmCache) return;

        const currentNoteId = fmCache["id"];

        // CachedMetadataにまだ登録されていない場合、stdノート以外でidを持たない場合はreturn;
        if (!currentNoteId) return;
        if (currentNoteId.startsWith("diary_")) return;
        if (typeof currentNoteId !== "string") throw new Error("invalid note id");

        const editWatcher = OEwM().userEditWatcher;
        if (editWatcher.editedNoteIds.includes(currentNoteId)) {
            editWatcher.watchOnceAfterEdit(currentNoteId, () => {
                this._updateCacheWhenMetadataChanged(currentNoteId, tFile);
            })
            return;
        }

        this._updateCacheWhenMetadataChanged(currentNoteId, tFile);

        // if (!this._preMetadataChangedId || this._preMetadataChangedId === currentNoteId) {
        //     this._debouncedUpdateCacheWhenMetadataChanged(currentNoteId, tFile);
        // } else {
        //     this._preMetadataChangedId = currentNoteId;
        //     this._updateCacheWhenMetadataChanged(currentNoteId, tFile);
        // }
    }

    // private _debouncedUpdateCacheWhenMetadataChanged = debounce(this._updateCacheWhenMetadataChanged, 1500, true);
    private async _updateCacheWhenMetadataChanged(noteId: string, tFile: TFile) {
        const cache = OAM().app.metadataCache.getFileCache(tFile);
        if (!cache) OEM.throwUnexpectedError();
        const fmCache = cache?.frontmatter;
        if (fmCache?.id !== noteId) OEM.throwUnexpectedError();

        // ノートトラッシュ時
        if (fmCache["oldPath"]) {
            this._deleteNoteCache(noteId, tFile, fmCache, cache);
            return;
        }

        const noteOrb = OOM().getStdNoteOrb({ noteId: noteId });
        if (!noteOrb) return;
        const currentSource = noteOrb.note.source;
        if (!currentSource) {
            OEM.reportNothingSource(tFile.path);
            return;
        }

        // ノート作成時。
        if (currentSource.unCacheInitialized) {
            this._initializeNewNote(currentSource);
        }

        const { newOutLinkIds, notHasIdLinks } = this._getNewOutLinkIds(cache);
        this._updateNoteSource(currentSource, newOutLinkIds);

        // ノート内にリンク先の存在しない内部リンクが作成されたとき。
        if (newOutLinkIds.size) {
            await this._promptCreateNewNoteForUnresolvedLinks(notHasIdLinks, noteOrb);
        }


        // ノート内にfmのlinkedNoteに存在しない内部リンクが置かれた時。
        const linkedNoteIds = noteOrb.reader.linkedNoteIds;
        const addLinkedNoteIds: Set<string> = new Set();
        currentSource.outLinkIds.forEach(id => {
            if (!linkedNoteIds.includes(id)) {
                addLinkedNoteIds.add(id);
            }
        });
        if (addLinkedNoteIds.size) {
            await this._promptAddLinkedNotes([...addLinkedNoteIds], noteOrb);
        }

        // TODO: inLinks変更の感知が厳しいので、結局こうする。
        OVM().reloadStdNoteViews();
    }

    private async _promptAddLinkedNotes(addLinkedNoteIds: string[], noteOrb: StdNoteOrb) {
        await PromptAddLinkedNoteModal.get(addLinkedNoteIds, noteOrb);
    }

    private async _promptCreateNewNoteForUnresolvedLinks(notHasIdLinks: Set<string>, rootNoteOrb: StdNoteOrb): Promise<StdNoteOrb[]> {
        const newNoteOrbList: StdNoteOrb[] = [];
        for (const link of notHasIdLinks) {
            const tFile = OAM().app.metadataCache.getFirstLinkpathDest(link, rootNoteOrb.note.path);
            if (tFile) continue;

            const noteType = await PromptSelectModal.get(
                "Unresolved link has been created. You create new note?",
                [
                    { value: "my", label: "my note" },
                    { value: "log", label: "log note" },

                ]
            )
            let conf: NewStdNoteConf | null;
            let orb: StdNoteOrb | null;
            switch (noteType) {
                case ("my"):
                    conf = await PromptNewMyNoteConfModal.get({ baseName: link, rootNote: rootNoteOrb.note });
                    if (!isNewMyNoteConf(conf)) continue;
                    orb = await OUM().noteCreator.createMyNote(conf);
                    break;
                case ("log"):
                    conf = await PromptNewLogNoteConfModal.get({ baseName: link, rootNote: rootNoteOrb.note });
                    if (!isNewLogNoteConf(conf)) continue;
                    orb = await OUM().noteCreator.createLogNote(conf);
                    break;
                default:
                    continue;
            }

            newNoteOrbList.push(orb);
        }
        return newNoteOrbList;
    }

    private _updateNoteSource(noteSource: StdNoteSource, newOutLinkIds: Set<string>) {
        // 差分計算
        // 効率化の余地あり
        const removedIds = [...noteSource.outLinkIds].filter(id => !newOutLinkIds.has(id));
        const addedIds = [...newOutLinkIds].filter(id => !noteSource.outLinkIds.has(id));

        if (removedIds.length !== 0 || addedIds.length !== 0) {
            // 逆リンク削除
            removedIds.forEach(outLinkNoteId => {
                const outLinkNoteSource = this.getStdNoteSourceById(outLinkNoteId);
                outLinkNoteSource?.inLinkIds.delete(noteSource.id);
            });

            // 逆リンク追加
            addedIds.forEach(outLinkNoteId => {
                const target = this.getStdNoteSourceById(outLinkNoteId);
                target?.inLinkIds.add(noteSource.id);
            });

            // outLinkIds更新
            noteSource.outLinkIds = newOutLinkIds;
        }
    }

    private async _deleteNoteCache(noteId: string, tFile: TFile, fmCache: FrontMatterCache, cache: CachedMetadata) {
        const currentSource = this.getStdNoteSourceById(noteId);
        if (!currentSource) return;
        const { newOutLinkIds } = this._getNewOutLinkIds(cache);

        newOutLinkIds.forEach(outLinkNoteId => {
            const outLinkNoteSource = this.getStdNoteSourceById(outLinkNoteId);
            outLinkNoteSource?.inLinkIds.delete(noteId);
        });

        const noteR = ORM().noteR;
        const deletedFm: Record<string, FmValue> = {};
        for (const [key, value] of Object.entries(fmCache)) {
            deletedFm[`trashed_${key}`] = value;
        }
        deletedFm["trashed"] = generateCurrentIsoDatetime();

        console.log(fmCache, deletedFm);
        await noteR.deleteAndUpsertFmAttrs(tFile, fmCache, deletedFm)

        this._stdNoteSourceMapById.delete(noteId);
        this._stdNoteIdMapByName.delete(tFile.name);
    }

    private _initializeNewNote(noteSource: StdNoteSource) {
        delete noteSource.unCacheInitialized;
        ODM().todayRecordNoteIds.cIds.add(noteSource.id);
    }

    private _getNewOutLinkIds(cache: CachedMetadata): { newOutLinkIds: Set<string>, notHasIdLinks: Set<string> } {
        const newOutLinkIds: Set<string> = new Set<string>();
        const notHasIdLinks: Set<string> = new Set<string>();

        // まとめてリンク処理
        // アウトリンク先のノートIDを newOutLinkIds に追加している。
        // fileNameToIdMapに名前が見つからないものはスルー。

        [...(cache.frontmatterLinks || []), ...(cache.links || [])].forEach((linkObj: FrontmatterLinkCache | LinkCache) => {
            const fileName = getBasenameFromPath(linkObj.link);
            const id = this.getStdNoteIdByName(fileName);
            if (id) {
                newOutLinkIds.add(id);
            } else {
                notHasIdLinks.add(linkObj.link);
            }
        });

        return {
            newOutLinkIds,
            notHasIdLinks
        };
    }



    // _debouncedUpdateCacheWhenMetadataChanged = debounce(this._updateCacheWhenMetadataChanged, 1500, true);
    // private async _botuupdateCacheWhenMetadataChanged(tFile: TFile, cache: CachedMetadata, fmCache: FrontMatterCache, currentNoteId: string) {
    //     // console.log("updateCacheWhenMetadataChanged");

    //     // const fmCache = cache?.frontmatter;
    //     // if (!fmCache) return;

    //     // const currentNoteId = fmCache["id"];

    //     // // CachedMetadataにまだ登録されていない場合、stdノート以外でidを持たない場合はreturn;
    //     // if (!currentNoteId) return;
    //     // if (currentNoteId.startsWith("diary_")) return;
    //     // if (typeof currentNoteId !== "string") {
    //     //     OEM.reportNoteIdInvalid(tFile);
    //     //     return;
    //     // }

    //     // ノートトラッシュ時
    //     if (fmCache["oldPath"]) {
    //         const currentSource = this.getStdNoteSourceById(currentNoteId);
    //         if (!currentSource) return;
    //         const { newOutLinkIds } = this.getNewOutLinkIds(cache);

    //         newOutLinkIds.forEach(outLinkNoteId => {
    //             const outLinkNoteSource = this.getStdNoteSourceById(outLinkNoteId);
    //             outLinkNoteSource?.inLinkIds.delete(currentNoteId);
    //         });

    //         const noteR = ORM().noteR;
    //         const deletedFm: Record<string, FmValue> = {};
    //         for (const [key, value] of Object.entries(fmCache)) {
    //             deletedFm[`trashed_${key}`] = value;
    //         }
    //         deletedFm["trashed"] = generateCurrentIsoDatetime();

    //         console.log(fmCache, deletedFm);
    //         await noteR.deleteAndUpsertFmAttrs(tFile, fmCache, deletedFm)

    //         this._stdNoteSourceMapById.delete(currentNoteId);
    //         this._stdNoteIdMapByName.delete(tFile.name);
    //         return;
    //     }



    //     // if (!ONM().isStdNotePath(tFile.path)) return;
    //     const noteOrb = OOM().getStdNoteOrb({ noteId: currentNoteId });
    //     if (!noteOrb) return;
    //     const currentSource = noteOrb.note.source;
    //     if (!currentSource) {
    //         OEM.reportNothingSource(tFile.path);
    //         return;
    //     }


    //     // ノート作成時。
    //     if (currentSource.unCacheInitialized) {
    //         // キャッシュ初期登録フラグ
    //         delete currentSource.unCacheInitialized;
    //         ODM().todayRecordNoteIds.cIds.add(currentSource.id);
    //     }

    //     const { newOutLinkIds, notHasIdLinks } = this.getNewOutLinkIds(cache);

    //     // 差分計算
    //     // 効率化の余地あり
    //     const removedIds = [...currentSource.outLinkIds].filter(id => !newOutLinkIds.has(id));
    //     const addedIds = [...newOutLinkIds].filter(id => !currentSource.outLinkIds.has(id));

    //     if (removedIds.length !== 0 || addedIds.length !== 0) {
    //         // 逆リンク削除
    //         removedIds.forEach(outLinkNoteId => {
    //             const outLinkNoteSource = this.getStdNoteSourceById(outLinkNoteId);
    //             outLinkNoteSource?.inLinkIds.delete(currentNoteId);
    //         });

    //         // 逆リンク追加
    //         addedIds.forEach(outLinkNoteId => {
    //             const target = this.getStdNoteSourceById(outLinkNoteId);
    //             target?.inLinkIds.add(currentNoteId);
    //         });

    //         // outLinkIds更新
    //         currentSource.outLinkIds = newOutLinkIds;
    //     }



    //     // ノート内にリンク先の存在しない内部リンクが作成されたとき。
    //     const newNoteOrbList: StdNoteOrb[] = [];
    //     for (const link of notHasIdLinks) {
    //         const tFile = OAM().app.metadataCache.getFirstLinkpathDest(link, noteOrb.note.path);
    //         if (tFile) continue;

    //         const noteType = await PromptSelectModal.get(
    //             "Unresolved link has been created. You create new note?",
    //             [
    //                 { value: "my", label: "my note" },
    //                 { value: "log", label: "log note" },

    //             ]
    //         )
    //         let conf: NewStdNoteConf | null;
    //         let orb: StdNoteOrb | null;
    //         switch (noteType) {
    //             case ("my"):
    //                 conf = await PromptNewMyNoteConfModal.get({ baseName: link, rootNote: noteOrb.note });
    //                 if (!isNewMyNoteConf(conf)) continue;
    //                 orb = await OUM().noteCreator.createMyNote(conf);
    //                 break;
    //             case ("log"):
    //                 conf = await PromptNewLogNoteConfModal.get({ baseName: link, rootNote: noteOrb.note });
    //                 if (!isNewLogNoteConf(conf)) continue;
    //                 orb = await OUM().noteCreator.createLogNote(conf);
    //                 break;
    //             default:
    //                 continue;
    //         }

    //         newNoteOrbList.push(orb);
    //     }
    //     if (newNoteOrbList.length) return;

    //     // ノート内にfmのlinkedNoteに存在しない内部リンクが置かれた時。
    //     const linkedNoteIds = noteOrb.reader.linkedNoteIds;
    //     const addLinkedNoteIds: string[] = [];
    //     currentSource.outLinkIds.forEach(id => {
    //         if (!linkedNoteIds.includes(id)) {
    //             addLinkedNoteIds.push(id);
    //         }
    //     });
    //     if (addLinkedNoteIds.length) {
    //         const isAdd = await PromptAddLinkedNoteModal.get(addLinkedNoteIds, noteOrb);
    //         if (isAdd) return;
    //     }

    //     // TODO: inLinks変更の感知が厳しいので、結局こうする。
    //     OVM().reloadStdNoteViews();
    // }
}

export const OCM = () => {
    return OrbizCacheManager.getInstance();
}