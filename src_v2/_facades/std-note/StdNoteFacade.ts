import { IAppEnvReader } from "../../infrastructure/internal/app/AppEnvRules";

export class StdNoteFacade {

    これ、インフラに依存してるからダメだ。
    IAppEnvReaderは、IAppEnvFacadeとかにして、facades配下に定義した方がいいかも。


    いや、インフラ層に定義すれば十分か、

    constructor(
        private readonly _appEnvReader: IAppEnvReader
    ) {
    }
}