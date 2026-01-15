export interface FileWriter<TMetadata> {
    saveContent(path: string, content: string): Promise<void>;
    saveMeta(path: string, metadata: TMetadata): Promise<void>;
    saveBody(path: string, body: string): Promise<void>;
}