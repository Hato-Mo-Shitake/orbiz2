// export interface IFileSurfacy<TMetadata> {
//     exists(path: string): Promise<boolean>;
//     readMeta(path: string): Promise<TMetadata | null>;
//     readContent(path: string): Promise<string>;
//     saveMeta(path: string, data: TMetadata): Promise<void>;
//     saveBody(path: string, content: string): Promise<void>;
// }

export interface IFileReader<TMetadata> {
    exists(path: string): Promise<boolean>;
    readMeta(path: string): Promise<TMetadata>;
    readContent(path: string): Promise<string>;
}

export interface IFileWriter<TMetadata> {
    saveMeta(path: string, data: TMetadata): Promise<void>;
    saveBody(path: string, content: string): Promise<void>;
}

export type FileSurfacy<TMetadata> =
    IFileReader<TMetadata> & IFileWriter<TMetadata>;