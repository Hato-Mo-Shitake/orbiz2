import OrbizPlugin from "main";
import { App } from "obsidian";
import { AM } from "./AppManager";
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
        private readonly orbizPlugin: OrbizPlugin
    ) {
        this.looksRegistrar = new LooksRegistrar();
        this.commandRegistrar = new CommandRegister();
        this.eventRegistrar = new EventRegistrar();
        this.viewRegistrar = new ViewRegistrar();
    }

    async initialize(): Promise<void> {
        // NOTE: 依存関係注意
        await this._build();

        await AM.orbizSetting.initialize();
        await AM.cache.initialize();

        this.looksRegistrar.register();
        this.commandRegistrar.register();
        this.eventRegistrar.register();
        this.viewRegistrar.register();

        await AM.diary.initialize();
    }

    private async _build(): Promise<void> {
        AM.initialize(this.app, this.orbizPlugin);
        // ObsidianManager.setInstance(this.app);
        // OrbizManager.setInstance(this.orbizPlugin);
        // CacheManager.setInstance();
        // DiaryManager.setInstance();
        // EventWatchManager.setInstance();
        // FactoryManager.setInstance();
        // NoteManager.setInstance();
        // NoteHistoryManager.setInstance();





        // OrbizSettingManager.setInstance(this.orbizPlugin);
        // OrbizAppManager.setInstance(this.app, this.OrbizPlugin);

        // OrbizDiaryManager.setInstance();
        // OrbizFactoryManager.setInstance();
        // OrbizRepositoryManager.setInstance();
        // OrbizUseCaseManager.setInstance();
        // OrbizTFileManager.setInstance();
        // OrbizTFolderManager.setInstance();
        // OrbizNoteManager.setInstance();
        // OrbizCacheManager.setInstance();
        // OrbizOrbManager.setInstance();
        // OrbizViewManager.setInstance();
        // OrbizEventWatchManager.setInstance();

        // OrbizNoteHistoryManager.setInstance();
    }
}