import { CachedMetadata, FrontMatterCache, TFile } from "obsidian";
import { BaseFm } from "src/orbits/schema/frontmatters/fm";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { OTM } from "src/orbiz/managers/OrbizTFileManager";

export abstract class BaseNote<TFm extends BaseFm = BaseFm> {
    readonly id: string;
    constructor(
        fm: TFm,
    ) {
        this.id = fm["id"];
    }

    get name(): string {
        return this.tFile.name;
    }

    get baseName(): string {
        return this.tFile.basename;
    }

    abstract get path(): string;

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

    private _tFile: TFile | null;
    get tFile(): TFile {
        if (!this._tFile) {
            this._tFile = OTM().getMdTFileByPath(this.path)!
        }
        return this._tFile;
    }

    // なるべく最新の状態を返すために、fmは自身に持たないようにする。
    get fmCache(): FrontMatterCache | null {
        return this.metadata.frontmatter || null;
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