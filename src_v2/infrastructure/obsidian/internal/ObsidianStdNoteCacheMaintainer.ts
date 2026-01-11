import { App, MetadataCache, TFile, Vault } from "obsidian";
import { IStdNoteCacheMaintainer, StdNoteIdsByName, StdNoteSource, StdNoteSourcesById } from "../std-note/IStdNoteCacheMaintainer";
import { ObsidianAppEnvReader } from "./ObsidianAppEnvReader";
import { getAllFilesByFolderPath, getFrontmatterByTFile } from "./obsidian-file.utils";

export class ObsidianStdNoteSourceMaintainer implements IStdNoteCacheMaintainer {
    constructor(
        private readonly _app: App,
        private readonly _appEnvReader: ObsidianAppEnvReader,
    ) {
    }

    private get _vault(): Vault {
        return this._app.vault;
    }

    private get _metadataCache(): MetadataCache {
        return this._app.metadataCache;
    }

    async build(): Promise<{
        sourceMap: StdNoteSourcesById,
        idMap: StdNoteIdsByName,
    }> {
        const sourcesById: StdNoteSourcesById = new Map<string, StdNoteSource>();
        const idsByName: StdNoteIdsByName = new Map<string, string>();

        const files = await this._getAllStdFiles();

        files.forEach(file => {
            const fm = getFrontmatterByTFile(this._metadataCache, file);

            const id = fm["id"];

            if (id === undefined) {
                console.error(`StdNoteId must not be empty. path: ${file.path}`);
                // TODO: ここでデータ不備を記録する処理。他も同様。
                return;
            }

            if (!String.isString(id)) {
                console.error(`StdNoteId must be string. path: ${file.path}`);
                return;
            }

            const name = file.basename;
            if (idsByName.has(name)) {
                console.error("file name conflict. name, path: ", name, file.path);
                return;
            }

            idsByName.set(name, id);
        });

    }

    private async _getSpaceName(): Promise<string> {
        return this._appEnvReader.getActiveSpaceName();
    }

    private async _getAllMyFiles(): Promise<TFile[]> {
        const spaceName = await this._getSpaceName();
        return getAllFilesByFolderPath(this._vault, `${spaceName}/galaxies`);
    }

    private async _getAllLogFiles(): Promise<TFile[]> {
        const spaceName = await this._getSpaceName();
        return getAllFilesByFolderPath(this._vault, `${spaceName}/logs`);
    }

    private async _getAllStdFiles(): Promise<TFile[]> {
        const myFiles = await this._getAllMyFiles();
        const logFiles = await this._getAllLogFiles();

        return myFiles.concat(logFiles);
    }
}