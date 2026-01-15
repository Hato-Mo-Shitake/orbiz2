import { MarkdownFileMetadata } from "./markdown-file.rules";

export interface MarkdownFileEventWatcher {
    onMarkdownFileMetadataChanged(callback: (path: string, metadata: MarkdownFileMetadata) => Promise<void>): void;
    onMarkdownFilePathChanged(callback: (newPath: string, oldPath: string) => Promise<void>): void;
}