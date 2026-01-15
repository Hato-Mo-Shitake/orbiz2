import { IFileReader } from "../file/FileReader";
import { IFileWriter } from "../file/FileWriter";
import { IMarkdownFileEditableFeature } from "./MarkdownFileEditableFeature";

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