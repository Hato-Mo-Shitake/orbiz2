import { App, MetadataCache, TFile, Vault } from "obsidian";
import { isStringArray } from "../../../../_utils/common/array.utils";
import { StdNoteId, StdNoteIdList, StdNotePath } from "../../../../domain/std-note";
import { AppEnvRules } from "../../app/AppEnvRules";
import { Frontmatter } from "../../markdown-file/markdown-file.rules";
import { StdNoteCacheValue, StdNoteIdsByName, StdNoteSource, StdNoteSourcesById } from "../../std-note/std-note-cache.rules.ts";
import { StdNoteCacheInitializer } from "../../std-note/StdNoteCacheInitializer";
import { StdNoteCacheReader } from "../../std-note/StdNoteCacheReader";
import { StdNoteCacheUpdater } from "../../std-note/StdNoteCacheUpdater";
import { getObsidianFilesByFolderPath, getObsidianFrontmatterByFile, getObsidianMarkdownFile } from "./obsidian-markdown-file.helpers";

export class ObsidianStdNoteCache implements StdNoteCacheInitializer, StdNoteCacheReader, StdNoteCacheUpdater {
    private _cache: StdNoteCacheValue | null = null;

    constructor(
        private readonly _app: App,
        private readonly _appEnvRules: AppEnvRules,
    ) {
    }

    private get _vault(): Vault {
        return this._app.vault;
    }

    private get _metadataCache(): MetadataCache {
        return this._app.metadataCache;
    }

    get cache(): StdNoteCacheValue {
        if (this._cache === null) {
            throw new Error("Not built ObsidianStdNoteCache.");
        }

        return this._cache;
    }

    get sourceMap(): Map<string, StdNoteSource> {
        return this.cache.sourceMap;
    }

    get idMap(): Map<string, string> {
        return this.cache.idMap;
    }

    findSourceById(noteId: StdNoteId): StdNoteSource | null {
        return this.cache.sourceMap.get(noteId.toString()) || null;
    }

    getSourceById(noteId: StdNoteId): StdNoteSource {
        const source = this.findSourceById(noteId);
        if (source === null) {
            throw new Error(`Not Found StdNoteSource. noteId: ${noteId}`);
        }
        return source;
    }

    async initialize(): Promise<void> {
        const sourcesById: StdNoteSourcesById = new Map<string, StdNoteSource>();
        const idsByName: StdNoteIdsByName = new Map<string, string>();

        const tmpCacheMap = new Map<string, { file: TFile, id: string, fm: Frontmatter }>();

        const files = await this._getAllStdFiles();
        files.forEach(file => {
            const fm = getObsidianFrontmatterByFile(this._metadataCache, file);
            const id = fm["id"];

            if (id === undefined) {
                console.error(`StdNoteId must not be empty. path: ${file.path}`);
                // TODO: ここでデータ不備を記録する処理。他も同様。
                // 不憫管理を行うドメイン作るか 
                // １つの不備に対応するEntityを作成して。
                return;
            }

            if (!String.isString(id)) {
                console.error(`StdNoteId must be string. path: ${file.path}`);
                return;
            }

            tmpCacheMap.set(file.path, {
                file,
                id,
                fm,
            });

            sourcesById.set(id, {
                id,
                path: file.path,
                outLinkIds: new Set<string>(),
                inLinkIds: new Set<string>(),
            });

            const name = file.basename;
            if (idsByName.has(name)) {
                console.error("file name conflict. name, path: ", name, file.path);
                return;
            }
            idsByName.set(name, id);
        });

        const resolvedLinks = this._metadataCache.resolvedLinks;
        for (const [notePath, interanlOutLinkPaths] of Object.entries(resolvedLinks)) {
            if (!this._appEnvRules.isStdFilePath(notePath)) continue;

            const tmpCache = tmpCacheMap.get(notePath);
            if (tmpCache === undefined) {
                // 想定外エラー
                console.error(`Not found tmpCache. path: ${notePath}`);
                continue;
            }
            const noteId = tmpCache.id;
            const fm = tmpCache.fm;

            const outLinkIds = new Set<string>(this._extractOutLinkIdsFromFrontmatter(fm, notePath));
            for (const internalOutLinkPath of Object.keys(interanlOutLinkPaths)) {
                if (!this._appEnvRules.isStdFilePath(internalOutLinkPath)) continue;
                const file = getObsidianMarkdownFile(this._vault, internalOutLinkPath);
                const outLinkId = this._findRawNoteIdByTFile(file);
                if (outLinkId === null) continue;

                outLinkIds.add(outLinkId);
            }

            const source = sourcesById.get(noteId);
            if (source === undefined) {
                console.error(`Not found StdNoteSource. path: ${notePath}`);
                continue;
            }
            source.outLinkIds = outLinkIds;

            for (const outLinkId of outLinkIds) {
                const outLinkNoteSource = sourcesById.get(outLinkId);
                if (outLinkNoteSource === undefined) {
                    console.error(`Not found StdNoteSource. id: ${outLinkId}`);
                    continue;
                }
                outLinkNoteSource.inLinkIds.add(noteId);
            }
        }

        this._cache = {
            sourceMap: sourcesById,
            idMap: idsByName,
        }
    }

    async updateByChangedNoteLinkId(noteId: StdNoteId, newOutLinkIdList: StdNoteIdList): Promise<void> {
        if (this._cache === null) {
            throw new Error("Not built ObsidianStdNoteCache.");
        }

        try {
            const source = this.getSourceById(noteId);
            const currentOutLinkIdList = StdNoteIdList.fromRawIdList([...source.outLinkIds]);

            if (currentOutLinkIdList.equals(newOutLinkIdList)) return;

            // 差分計算
            const removedIdList = currentOutLinkIdList.removeList(newOutLinkIdList);
            const addIdList = newOutLinkIdList.removeList(currentOutLinkIdList);

            removedIdList.toArray().forEach(id => {
                const outLinkSource = this.getSourceById(id);
                outLinkSource.inLinkIds.delete(noteId.toString());
            });

            addIdList.toArray().forEach(id => {
                const outLinkSource = this.getSourceById(id);
                outLinkSource.inLinkIds.add(noteId.toString());
            });

            source.outLinkIds = new Set(
                newOutLinkIdList.toArray().map(id => id.toString())
            );
        } catch (e) {
            // TODO: 場合によってはここでエラーの内容を判定して、システム不備をスタック
            // ここでEventBusとか飛ばすとかはありそうだな
            console.error(e);
        }
    }

    async updateByChangedNotePath(noteId: StdNoteId, newPath: StdNotePath): Promise<void> {
        if (this._cache === null) {
            throw new Error("Not built ObsidianStdNoteCache.");
        }

        try {
            this._updateSourceMapByChangedNotePath(noteId, newPath);
            this._updateIdMapByChangedNotePath(noteId, newPath);
        } catch (e) {
            console.error(e);
        }
    }

    async updateByCreatedNote(noteId: StdNoteId, notePath: StdNotePath, outLinkIdList: StdNoteIdList): Promise<void> {
        if (this._cache === null) {
            throw new Error("Not built ObsidianStdNoteCache.");
        }

        try {
            const source = this.findSourceById(noteId);
            if (source !== null) {
                console.error(`Already exists StdNoteSource. id: ${noteId.toString()}`);
                return;
            }

            const newSource = {
                id: noteId.toString(),
                path: notePath.toString(),
                outLinkIds: new Set<string>(),
                inLinkIds: new Set<string>(),
            }

            // 新規セットして、linkidの調整。
            this._cache.sourceMap.set(noteId.toString(), newSource);
            await this.updateByChangedNoteLinkId(
                noteId,
                outLinkIdList
            );
        } catch (e) {
            console.error(e);
        }
    }

    async updateByTrashedNote(noteId: StdNoteId): Promise<void> {
        if (this._cache === null) {
            throw new Error("Not built ObsidianStdNoteCache.");
        }

        const source = this.findSourceById(noteId);
        if (source === null) {
            console.error(`Not found StdNoteSource. id: ${noteId.toString()}`);
            return;
        }

        const name = StdNotePath.from(source.path).getNoteName();
        if (this._cache.idMap.get(name.toString()) !== noteId.toString()) {
            throw new Error(
                `想定外のエラー. ${this._cache.idMap.get(name.toString())} !== ${noteId.toString()}`
            );
        }

        // ここで、他のStdNoteSourceのinlinkIdを削除用更新
        await this.updateByChangedNoteLinkId(
            noteId,
            StdNoteIdList.from([])
        );

        // 削除
        this._cache.idMap.delete(name.toString());
        this._cache.sourceMap.delete(noteId.toString());
    }

    private _updateSourceMapByChangedNotePath(noteId: StdNoteId, newPath: StdNotePath): void {
        const source = this.getSourceById(noteId);
        const oldPath = StdNotePath.from(source.path);

        if (newPath.equals(oldPath)) return;

        source.path = newPath.toString();
    }

    private _updateIdMapByChangedNotePath(noteId: StdNoteId, newPath: StdNotePath): void {
        const newName = newPath.getNoteName();

        const source = this.getSourceById(noteId);
        const oldPath = StdNotePath.from(source.path);
        const oldName = oldPath.getNoteName();

        if (newName.equals(oldName)) return;

        const idMap = this.cache.idMap;

        const currentId = idMap.get(oldName.toString());
        if (currentId !== noteId.toString()) {
            throw new Error(`致命的エラー. ${currentId} !== ${noteId.toString()}`);
        }

        idMap.set(newName.toString(), noteId.toString());
        idMap.delete(oldName.toString());
    }

    private async _getAllMyFiles(): Promise<TFile[]> {
        return getObsidianFilesByFolderPath(
            this._vault,
            this._appEnvRules.myFolderPath
        );
    }

    private async _getAllLogFiles(): Promise<TFile[]> {
        return getObsidianFilesByFolderPath(
            this._vault,
            this._appEnvRules.logFolderPath
        );
    }

    private async _getAllStdFiles(): Promise<TFile[]> {
        const myFiles = await this._getAllMyFiles();
        const logFiles = await this._getAllLogFiles();

        return myFiles.concat(logFiles);
    }

    private _findRawNoteIdByTFile(file: TFile): string | null {
        const fm = getObsidianFrontmatterByFile(this._metadataCache, file);

        const id = fm["id"];

        if (id === undefined) {
            console.error(`StdNoteId must not be empty. path: ${file.path}`);
            // TODO: ここでデータ不備を記録する処理。他も同様。
            // 不憫管理を行うドメイン作るか 
            // １つの不備に対応するEntityを作成して。
            return null;
        }

        if (!String.isString(id)) {
            console.error(`StdNoteId must be string. path: ${file.path}`);
            return null;
        }

        return id
    }

    private _extractOutLinkIdsFromFrontmatter(fm: Frontmatter, notePath: string): string[] {
        let belongsTo = fm["belongsTo"];
        if (!isStringArray(belongsTo)) {
            console.error(`Invalid belongsTo. path: ${notePath}`);
            belongsTo = [];
        }

        let relatesTo = fm["relatesTo"];
        if (!isStringArray(relatesTo)) {
            console.error(`Invalid relatesTo. path: ${notePath}`);
            relatesTo = [];
        }

        let references = fm["references"];
        if (!isStringArray(references)) {
            console.error(`Invalid references. path: ${notePath}`);
            references = [];
        }

        return [...belongsTo as string[], ...relatesTo as string[], ...references as string[]];
    }
}