import { IFileReader } from "../file/IFileReader";
import { IFileWriter } from "../file/IFileWriter";
import { IMarkdownFileEditableFeature } from "./IMarkdownFileEditableFeature";

export type FrontmatterValue = string | number | boolean | string[] | number[] | boolean[];
export type FrontmatterAttrs = Record<string, FrontmatterValue>;
export type Frontmatter = FrontmatterAttrs;

export interface MarkdownFileMetadata {
    frontmatter?: Frontmatter;
    // list?:
    // taskList?: 
    // footnotes?:
}

export type MarkdownFileReader = IFileReader<MarkdownFileMetadata>;
export type MarkdownFileWriter = IFileWriter<MarkdownFileMetadata> & IMarkdownFileEditableFeature;