import { App, MetadataCache, TFile, Vault } from "obsidian";
import { StdNote, StdNoteId, StdNoteIdList, StdNotePath } from "../../../../domain/std-note";
import { AppEnvRules } from "../../app/AppEnvRules";
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

        const files = await this._getAllStdFiles();

        files.forEach(file => {
            const id = this._findRawNoteIdByTFile(file);
            if (id === null) return;
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
        for (const [notePath, targets] of Object.entries(resolvedLinks)) {
            if (!this._appEnvRules.isStdFilePath(notePath)) continue;

            const file = getObsidianMarkdownFile(this._vault, notePath);

            const noteId = this._findRawNoteIdByTFile(file);
            if (noteId === null) continue;

            const source = sourcesById.get(noteId);
            if (source === undefined) {
                console.error(`Not found StdNoteSource. path: ${notePath}`);
                continue;
            }

            const outLinkIds = new Set<string>();

            for (const targetPath of Object.keys(targets)) {
                if (!this._appEnvRules.isStdFilePath(targetPath)) continue;
                const file = getObsidianMarkdownFile(this._vault, targetPath);
                const targetId = this._findRawNoteIdByTFile(file);
                if (targetId === null) continue;

                outLinkIds.add(targetId);

                const targetSource = sourcesById.get(targetId);
                if (targetSource === undefined) {
                    console.error(`Not found StdNoteSource. path: ${targetPath}`);
                    continue;
                }
                targetSource.inLinkIds.add(noteId);
            }

            source.outLinkIds = outLinkIds;
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

    async updateByCreatedNote(note: StdNote): Promise<void> {

    }

    async updateByTrashedNote(note: StdNote): Promise<void> {

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
}