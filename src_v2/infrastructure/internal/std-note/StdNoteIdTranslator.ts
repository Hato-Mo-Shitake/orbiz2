import { isStringArray } from "../../../_utils/common/array.utils";
import { MarkdownFilePath } from "../../../domain/common/MarkdownFilePath.vo";
import { StdNoteId, StdNoteIdList, StdNoteName, StdNotePath } from "../../../domain/std-note";
import { Frontmatter, MarkdownFileMetadata } from "../markdown-file/markdown-file.rules";
import { StdNoteCacheReader } from "./StdNoteCacheReader";

/**
 * キャッシュ依存の処理
 */
export class StdNoteIdTranslator {
    constructor(
        private readonly _cacheReader: StdNoteCacheReader,
    ) {
    }

    private get _idMap(): Map<string, string> {
        return this._cacheReader.idMap;
    }

    /**
     * @param markdownFilePath 
     * @returns 
     */
    tryFromStdNotePath(path: StdNotePath): StdNoteId | null {
        const name = path.getNoteName();

        const rawId = this._idMap.get(name.toString()) || null;

        return rawId ? StdNoteId.from(rawId) : null;
    }



    fromMarkdownFileMetadata(metadata: MarkdownFileMetadata): StdNoteIdList {
        const fm = metadata.frontmatter;
        const idListFromFm = fm ? this.fromFrontmatter(fm) : StdNoteIdList.from([]);

        const mdPaths = metadata.markdownFileLinks;
        const idListFromMdPaths = mdPaths ? this.fromMarkdownFilePaths(mdPaths) : StdNoteIdList.from([]);

        return idListFromFm.addList(idListFromMdPaths);
    }

    fromFrontmatter(frontmatter: Frontmatter): StdNoteIdList {
        const belongsTo = frontmatter["belongsTo"];
        const parentRawIds = isStringArray(belongsTo) ? belongsTo : [];

        const relatesTo = frontmatter["relatesTo"];
        const relativeRawIds = isStringArray(relatesTo) ? relatesTo : [];

        const references = frontmatter["references"];
        const referenceRawIds = isStringArray(references) ? references : [];

        return StdNoteIdList.fromRawIdList([
            ...parentRawIds,
            ...relativeRawIds,
            ...referenceRawIds
        ]);
    }

    fromMarkdownFilePaths(markdownFilePaths: MarkdownFilePath[]): StdNoteIdList {
        const paths = this._toNotePathsFromMarkdownFilePaths(markdownFilePaths);
        const names = this._toNoteNamesFromPaths(paths);


        const rawIds: string[] = [];

        for (const name of names) {
            const rawId = this._idMap.get(name.toString());
            if (rawId === undefined) continue;
            rawIds.push(rawId);
        }

        return StdNoteIdList.fromRawIdList(rawIds);
    }

    private _toNotePathsFromMarkdownFilePaths(markdownFilePaths: MarkdownFilePath[]): StdNotePath[] {
        return markdownFilePaths.map(path => StdNotePath.from(path.toString()));
    }

    private _toNoteNamesFromPaths(paths: StdNotePath[]): StdNoteName[] {
        return paths.map(path => path.getNoteName());
    }
}