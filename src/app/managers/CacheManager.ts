import { CachedMetadata, debounce, Editor, FrontMatterCache, FrontmatterLinkCache, LinkCache, MarkdownView, TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { generateCurrentIsoDatetime } from "src/assistance/utils/date";
import { debugConsole } from "src/assistance/utils/debug";
import { iterateNoteLines } from "src/assistance/utils/editor";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { DiaryNoteOrb, isDiaryNoteOrb, isStdNoteOrb, StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { NoIdNoteError } from "src/errors/NoIdNoteError";
import { NotInitializedError } from "src/errors/NotInitializedError";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { BaseFm } from "src/orbits/schema/frontmatters/fm";
import { FmValue } from "src/orbits/schema/frontmatters/FmKey";
import { StdNoteSource } from "src/orbits/schema/NoteSource";

export class CacheManager {
    private static _instance: CacheManager | null = null;

    static setInstance(): void {
        this._instance = new CacheManager();
    }

    static getInstance(): CacheManager {
        if (!this._instance) throw new NotInitializedError();
        return this._instance;
    }

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
        const id = AM.note.getNoteIdByTFile(tFile);
        if (!id) return null;

        const source = this.getStdNoteSourceById(id);
        if (!source) return null;

        return source;
    }
    getStdNoteSourceByFm(fm: BaseFm): StdNoteSource | null {
        const id = fm.id;

        const source = this.getStdNoteSourceById(id);
        if (!source) return null;

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

    private readonly _deletedCacheNoteIdList = new Set<string>();
    updateNoteOrbCaches(): void {
        const leaves = AM.obsidian.workspace.getLeavesOfType("markdown");
        const aliveNoteIds = new Set<string>();
        const stdCacheMap = this._stdNoteOrbMapById;
        const diaryCacheMap = this._diaryNoteOrbMapById;

        leaves.forEach(leaf => {
            const view = leaf.view;
            if (!(view instanceof MarkdownView)) return;
            const tFile = view.file;
            if (!tFile) return;

            const orb = AM.orb.getNoteOrb({ tFile });
            // if (!orb) throw new UnexpectedError();
            if (!orb) return;
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
                throw new UnexpectedError();
            }

            aliveNoteIds.add(noteId);
        });

        for (const id of stdCacheMap.keys()) {
            if (!aliveNoteIds.has(id)) {
                // Note: 二回削除候補に上がったら消す。
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
    }

    initialize(): void {
        debugConsole('cache initializing start.');
        const { app } = AM.obsidian;

        AM.tFile.allStdTFiles.forEach(file => {
            const name = file.basename;

            const id = AM.note.getNoteIdByTFile(file);
            if (!id) {
                console.warn("missing note id. path: ", file.path);
                return;
            }

            if (this._stdNoteSourceMapById.has(id)) {
                console.warn("note id conflict. id, path: ", id, file.path);
                return;
            }
            this._stdNoteSourceMapById.set(id, {
                id,
                path: file.path,
                outLinkIds: new Set<string>(),
                inLinkIds: new Set<string>(),
            });

            if (this._stdNoteIdMapByName.has(name)) {
                console.warn("file name conflict. name, path: ", name, file.path);
                return;
            }

            this._stdNoteIdMapByName.set(name, id);
        });

        const resolvedLinks = app.metadataCache.resolvedLinks;
        for (const [sourcePath, targets] of Object.entries(resolvedLinks)) {
            if (!AM.note.isStdNotePath(sourcePath)) continue;

            const noteId = AM.note.getNoteIdByPath(sourcePath);
            if (!noteId) {
                console.error(`no id: ${sourcePath}`);
                continue;
            }

            const source = this.getStdNoteSourceById(noteId);
            if (!source) {
                console.error(`no source std note: ${sourcePath}`);
                continue
            }

            const outLinkIds: Set<string> = new Set<string>();
            for (const targetPath of Object.keys(targets)) {
                if (!AM.note.isStdNotePath(sourcePath)) continue;
                const targetId = AM.note.getNoteIdByPath(targetPath);
                if (!targetId) continue;

                outLinkIds.add(targetId);

                // inLinkIds の逆引きも追加
                const targetNote = this.getStdNoteSourceById(targetId);
                if (targetNote) targetNote.inLinkIds.add(noteId);

            }

            source.outLinkIds = outLinkIds;
        }

        debugConsole("cache initialized.");
    }

    private _prePathChangedId: string | null = null;
    updateCacheWhenPathChanged = (tFile: TFile, oldPath: string) => {
        console.log("updateCacheWhenPathChanged start.");
        if (tFile.extension !== "md") return;
        if (!AM.note.isStdNotePath(oldPath)) return;

        const oldName = getBasenameFromPath(oldPath);
        const newName = getBasenameFromPath(tFile.path);

        const id = this._stdNoteIdMapByName.get(oldName);
        if (!id) throw new NoIdNoteError(tFile.path);

        this._updateCacheWhenPathChanged(tFile, oldName, newName, id);
    }
    // private _debouncedUpdateCacheWhenPathChanged = debounce(this._updateCacheWhenPathChanged, 1500, true);
    private _updateCacheWhenPathChanged(tFile: TFile, oldName: string, newName: string, id: string): void {
        // const source = this.getStdNoteSourceByTFile(tFile);
        const source = this.getStdNoteSourceById(id);
        if (!source) return;

        // 更新
        // source.path = tFile.path;

        // 更新
        const oldSource = this._stdNoteSourceMapById.get(id)!;
        const newSource: StdNoteSource = { ...oldSource, path: tFile.path };

        this._stdNoteSourceMapById.set(id, newSource);
        this._stdNoteIdMapByName.delete(oldName);
        this._stdNoteIdMapByName.set(newName, id);

        for (const orb of this._stdNoteOrbMapById.values()) {
            orb.resetStoreInLinkIds();
            orb.resetStoreOutLinkIds();
        }
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

        const editWatcher = AM.eventWatch.userEditWatcher;
        if (editWatcher.editedNoteIds.includes(currentNoteId)) {
            editWatcher.watchOnceAfterEdit(currentNoteId, (editor: Editor) => {
                this._updateCacheWhenMetadataChanged(currentNoteId, tFile, editor);
            })
            return;
        }

        if (!this._preMetadataChangedId || this._preMetadataChangedId === currentNoteId) {
            this._debouncedUpdateCacheWhenMetadataChanged(currentNoteId, tFile);
        } else {
            this._prePathChangedId = currentNoteId;
            this._updateCacheWhenMetadataChanged(currentNoteId, tFile);
        }

        this._updateCacheWhenMetadataChanged(currentNoteId, tFile);
    }

    private _debouncedUpdateCacheWhenMetadataChanged = debounce(this._updateCacheWhenMetadataChanged, 500, true);
    private async _updateCacheWhenMetadataChanged(noteId: string, tFile: TFile, editor?: Editor) {

        const cache = AM.obsidian.metadataCache.getFileCache(tFile);

        if (!cache) throw new UnexpectedError();
        const fmCache = cache?.frontmatter;

        if (fmCache?.id !== noteId) throw new UnexpectedError();

        // ノートトラッシュ時
        if (fmCache["oldPath"]) {
            this._deleteNoteCache(noteId, tFile, fmCache, cache);
            return;
        }

        const noteOrb = AM.orb.getStdNoteOrb({ noteId: noteId });
        if (!noteOrb) return;
        const currentSource = noteOrb.note.source;
        if (!currentSource) return;

        // ノート作成時。
        if (currentSource.unCacheInitialized) {
            this._initializeNewNote(currentSource);
        }

        const { newOutLinkIds } = this._getNewOutLinkIds(cache);
        this._updateNoteSource(currentSource, newOutLinkIds);



        if (editor) {
            // ノート内にfmのlinkedNoteに存在しない内部リンクが置かれた時。
            const linkedNoteIds = noteOrb.reader.linkedNoteIds;
            const unlinkedStdNoteIds: Set<string> = new Set();
            currentSource.outLinkIds.forEach(id => {
                if (!linkedNoteIds.includes(id)) {
                    unlinkedStdNoteIds.add(id);
                }
            });

            if (unlinkedStdNoteIds.size) {
                await this._locateButtonAddLinkedNotes([...unlinkedStdNoteIds], noteOrb, editor);
            }
        }


        for (const orb of this._stdNoteOrbMapById.values()) {
            orb.resetStoreInLinkIds();
            orb.resetStoreOutLinkIds();
        }
        debugConsole(tFile.path, "キャッシュ更新");
    }

    private async _locateButtonAddLinkedNotes(unlinkedStdNoteIds: string[], rootNoteOrb: StdNoteOrb, editor: Editor) {
        for (const unlinkedStdNoteId of unlinkedStdNoteIds) {
            iterateNoteLines(editor, (line, lineText) => {
                if (!lineText) return;
                const unlinkedStdNoteSource = this.getStdNoteSourceById(unlinkedStdNoteId);
                if (!unlinkedStdNoteSource) return;

                const linkedNoteName = getBasenameFromPath(unlinkedStdNoteSource.path);
                if (!lineText.includes(`[[${linkedNoteName}]]`)) return;
                const escapedLink = `[[${linkedNoteName}]]`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const regex = new RegExp(escapedLink, "g");

                const newLine = lineText.replace(
                    regex,
                    `【@ `
                    + `[[${unlinkedStdNoteSource.path}|${linkedNoteName}]] `
                    + `<button class="add-unlinked-std-note-btn" data-unlinked-note-id="${unlinkedStdNoteId}" data-root-note-id="${rootNoteOrb.note.id}">added</button>`
                    + ` @】`
                )

                const from = { line: line, ch: 0 };
                const to = { line: line, ch: lineText.length };
                editor.blur();

                editor.replaceRange(newLine, from, to)
            });
        }
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

        const noteR = AM.repository.noteR;
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
        AM.diary.addDailyLogNoteIds("createdNotes", noteSource.id);
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
}
