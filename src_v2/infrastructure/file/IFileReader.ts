export interface IFileReader<TMetadata> {
    exists(path: string): Promise<boolean>;
    readContent(path: string): Promise<string>;
    readMeta(path: string): Promise<TMetadata>;
    readBody(path: string): Promise<string>;
}