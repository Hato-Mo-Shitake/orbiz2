import { MarkdownFilePath } from "../../../domain/common/MarkdownFilePath.vo";
import { MarkdownFileMetadata } from "./markdown-file.rules";

export interface MarkdownFileEventWatcher {
    onMarkdownFileMetadataChanged(callback: (path: MarkdownFilePath, metadata: MarkdownFileMetadata) => Promise<void>): void;
    onMarkdownFilePathChanged(callback: (newPath: MarkdownFilePath, oldPath: MarkdownFilePath) => Promise<void>): void;
}