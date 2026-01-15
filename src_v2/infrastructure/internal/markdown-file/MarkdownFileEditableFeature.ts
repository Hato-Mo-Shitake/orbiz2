import { Frontmatter, FrontmatterAttrs } from "./markdown-file.rules";

export interface MarkdownFileEditableFeature {
    saveFrontmatter(
        path: string,
        frontmatter: Frontmatter
    ): Promise<void>;

    saveFrontmatterAttrs(
        path: string,
        attrs: FrontmatterAttrs
    ): Promise<void>;
}