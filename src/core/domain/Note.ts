import { CachedMetadata, FrontMatterCache, TFile } from "obsidian";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { BaseFm } from "src/orbits/schema/frontmatters/fm";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { OTM } from "src/orbiz/managers/OrbizTFileManager";

export abstract class BaseNote<TFm extends BaseFm = BaseFm> {
    readonly id: string;
    constructor(
        fm: TFm,
    ) {
        this.id = fm["id"];
    }

    abstract get path(): string;

    get name(): string {
        return `${this.baseName}.md`;

        // return this.tFile.name;
    }

    get baseName(): string {
        return getBasenameFromPath(this.path);
    }

    get internalLink(): string {
        return `[[${this.path}|${this.name}]]`
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
        const _tFile = OTM().getMdTFileByPath(this.path);
        if (!_tFile) OEM.throwUnexpectedError();
        return _tFile;
    }

    // なるべく最新の状態を返すために、fmは自身に持たないようにする。
    get fmCache(): FrontMatterCache {
        const fmCache = this.metadata.frontmatter;
        if (!fmCache) OEM.throwUnexpectedError();
        return fmCache;
    }

    get metadata(): CachedMetadata {
        const cache = OAM().app.metadataCache.getFileCache(this.tFile);
        if (!cache) {
            throw new Error("not cache is empty.");
        }
        return cache;
    }

    read(): Promise<string> {
        return OAM().app.vault.cachedRead(this.tFile);
    }

    readActual(): Promise<string> {
        return OAM().app.vault.read(this.tFile);
    }
}