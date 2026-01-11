export interface IAppEnvReader {
    getActiveSpaceName(): Promise<string>;
}