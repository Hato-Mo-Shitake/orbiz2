import { MarkdownFilePath } from "../../../domain/common/MarkdownFilePath.vo";
import { MarkdownFileMetadata } from "./markdown-file.rules";

export interface MarkdownFileEventWatcher {
    onMetadataChanged(callback: (path: MarkdownFilePath, metadata: MarkdownFileMetadata) => Promise<void>): void;
    onPathChanged(callback: (newPath: MarkdownFilePath, oldPath: MarkdownFilePath) => Promise<void>): void;
}