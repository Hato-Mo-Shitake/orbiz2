import { CachedMetadata, FrontMatterCache, TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { debugConsole } from "src/assistance/utils/debug";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { BaseFm } from "src/orbits/schema/frontmatters/fm";

export abstract class BaseNote<TFm extends BaseFm = BaseFm> {
    readonly id: string;
    protected readonly _initialFm: FrontMatterCache;
    constructor(
        fm: TFm,
    ) {
        this.id = fm["id"];
        this._initialFm = fm;
    }

    abstract get path(): string;

    get name(): string {
        return `${this.baseName}.md`;
    }

    get baseName(): string {
        return getBasenameFromPath(this.path);
    }

    get internalLink(): string {
        return `[[${this.path}|${this.name}]]`
    }
    get fullPathInternalLink(): string {
        debugConsole("???");
        return `[[${this.path}]]`
    }

    private _created: Date | null = null;
    get created(): Date {
        if (!this._created) {
            this._created = new Date(this.ctime);
        }
        return this._created;
    }
    get ctime(): number {
        return this.tFile.stat.ctime;
    }
    get modified(): Date {
        // キャッシュは要検討
        return new Date(this.mtime);
    }
    get mtime(): number {
        return this.tFile.stat.mtime;
    }

    get tFile(): TFile {
        // NOTE: 常に最新のものを取得。
        const _tFile = AM.tFile.getMdTFileByPath(this.path);
        if (!_tFile) {
            console.error(this.path);
            throw new UnexpectedError();
        }
        return _tFile;
    }

    // なるべく最新の状態を返すためにこう
    get fmCache(): FrontMatterCache {
        const fmCache = this.metadata.frontmatter;
        if (!fmCache) return this._initialFm;
        return fmCache;
    }

    get metadata(): CachedMetadata {
        const cache = AM.obsidian.metadataCache.getFileCache(this.tFile);
        if (!cache) {
            throw new Error("not cache is empty.");
        }
        return cache;
    }

    read(): Promise<string> {
        return AM.obsidian.vault.cachedRead(this.tFile);
    }

    readActual(): Promise<string> {
        return AM.obsidian.vault.read(this.tFile);
    }
}