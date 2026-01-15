export interface AppEnvRules {
    initialize(): Promise<void>;

    activeSpaceName: string;
    myFolderPath: string;
    logFolderPath: string;

    isStdFilePath(path: string): boolean;
}