import { MarkdownFilePath } from "../../../domain/common/MarkdownFilePath.vo";
import { FileReader } from "../file/FileReader";
import { FileWriter } from "../file/FileWriter";
import { MarkdownFileEditableFeature } from "./MarkdownFileEditableFeature";

export type FrontmatterValue = string | number | boolean | string[] | number[] | boolean[];
export type FrontmatterAttrs = Record<string, FrontmatterValue>;
export type Frontmatter = FrontmatterAttrs;

export interface MarkdownFileMetadata {
    frontmatter?: Frontmatter;
    markdownFileLinks?: MarkdownFilePath[];
    otherLinks?: string[];
    // list?:
    // taskList?: 
    // footnotes?:
}

export type MarkdownFileReader = FileReader<MarkdownFileMetadata>;
export type MarkdownFileWriter = FileWriter<MarkdownFileMetadata> & MarkdownFileEditableFeature;