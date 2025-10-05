import MyPlugin from "main";
import { App } from "obsidian";
import { OrbizAppManager } from "src/orbiz/managers/OrbizAppManager";
import { OCM, OrbizCacheManager } from "src/orbiz/managers/OrbizCacheManager";
import { ODM, OrbizDiaryManager } from "src/orbiz/managers/OrbizDiaryManager";
import { OrbizEventWatchManager } from "src/orbiz/managers/OrbizEventWatchManager";
import { OrbizFactoryManager } from "src/orbiz/managers/OrbizFactoryManager";
import { OrbizNoteManager } from "src/orbiz/managers/OrbizNoteManager";
import { OrbizOrbManager } from "src/orbiz/managers/OrbizOrbManager";
// import { OrbizReactManager } from "src/orbiz/managers/OrbizReactManager";
import { OrbizNoteHistoryManager } from "src/orbiz/managers/OrbizNoteHistoryManager";
import { OrbizRepositoryManager } from "src/orbiz/managers/OrbizRepositoryManager";
import { OrbizSettingManager, OSM } from "src/orbiz/managers/OrbizSettingManager";
import { OrbizTFileManager } from "src/orbiz/managers/OrbizTFileManager";
import { OrbizTFolderManager } from "src/orbiz/managers/OrbizTFolderManager";
import { OrbizUseCaseManager } from "src/orbiz/managers/OrbizUseCaseManager";
import { OrbizViewManager } from "src/orbiz/managers/OrbizViewManager";
import { CommandRegister } from "./registrars/CommandRegistrar";
import { EventRegistrar } from "./registrars/EventRegistrar";
import { LooksRegistrar } from "./registrars/LooksRegistrar";
import { ViewRegistrar } from "./registrars/ViewRegistrar";

export class AppInitializer {
    private readonly looksRegistrar: LooksRegistrar;
    private readonly commandRegistrar: CommandRegister;
    private readonly eventRegistrar: EventRegistrar;
    private readonly viewRegistrar: ViewRegistrar;

    constructor(
        private readonly app: App,
        private readonly myPlugin: MyPlugin
    ) {
        this.looksRegistrar = new LooksRegistrar();
        this.commandRegistrar = new CommandRegister();
        this.eventRegistrar = new EventRegistrar();
        this.viewRegistrar = new ViewRegistrar();
    }

    async initialize(): Promise<void> {
        // NOTE: 依存関係注意
        await this._build();

        await OSM().initialize();
        await OCM().initialize();

        this.looksRegistrar.register();
        this.commandRegistrar.register();
        this.eventRegistrar.register();
        this.viewRegistrar.register();

        await ODM().initialize();
    }

    private async _build(): Promise<void> {
        OrbizSettingManager.setInstance(this.myPlugin);
        OrbizAppManager.setInstance(this.app, this.myPlugin);

        OrbizDiaryManager.setInstance();
        OrbizFactoryManager.setInstance();
        OrbizRepositoryManager.setInstance();
        OrbizUseCaseManager.setInstance();
        OrbizTFileManager.setInstance();
        OrbizTFolderManager.setInstance();
        OrbizNoteManager.setInstance();
        OrbizCacheManager.setInstance();
        OrbizOrbManager.setInstance();
        OrbizViewManager.setInstance();
        OrbizEventWatchManager.setInstance();

        OrbizNoteHistoryManager.setInstance();
        // OrbizReactManager.setInstance();
    }
}