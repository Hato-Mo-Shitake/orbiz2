import OrbizPlugin from "main";
import { App } from "obsidian";
import { CacheManager } from "./managers/CacheManager";
import { DiaryManager } from "./managers/DiaryManager";
import { EventWatchManager } from "./managers/EventWatchManager";
import { FactoryManager } from "./managers/FactoryManager";
import { LooksManager } from "./managers/LooksManager";
import { NoteHistoryManager } from "./managers/NoteHistoryManager";
import { NoteManager } from "./managers/NoteManager";
import { ObsidianManager } from "./managers/ObsidianManager";
import { OrbizManager } from "./managers/OrbizManager";
import { OrbizSettingManager } from "./managers/OrbizSettingManager";
import { OrbManager } from "./managers/OrbManager";
import { RepositoryManager } from "./managers/RepositoryManager";
import { TFileManager } from "./managers/TFileManager";
import { UseCaseManager } from "./managers/UseCaseManager";

class AppManager {
    initialize(app: App, orbizPlugin: OrbizPlugin) {
        ObsidianManager.setInstance(app);
        OrbizManager.setInstance(orbizPlugin);
        OrbizSettingManager.setInstance(orbizPlugin);

        CacheManager.setInstance();
        DiaryManager.setInstance();
        EventWatchManager.setInstance();
        FactoryManager.setInstance();
        NoteManager.setInstance();
        NoteHistoryManager.setInstance();
        OrbManager.setInstance();
        RepositoryManager.setInstance();
        TFileManager.setInstance();
        UseCaseManager.setInstance();
        LooksManager.setInstance();
    }

    get obsidian(): ObsidianManager {
        return ObsidianManager.getInstance();
    }
    get orbiz(): OrbizManager {
        return OrbizManager.getInstance();
    }
    get orbizSetting(): OrbizSettingManager {
        return OrbizSettingManager.getInstance();
    }

    get cache(): CacheManager {
        return CacheManager.getInstance();
    }
    get diary(): DiaryManager {
        return DiaryManager.getInstance();
    }
    get eventWatch(): EventWatchManager {
        return EventWatchManager.getInstance();
    }
    get factory(): FactoryManager {
        return FactoryManager.getInstance();
    }
    get note(): NoteManager {
        return NoteManager.getInstance();
    }
    get noteHistory(): NoteHistoryManager {
        return NoteHistoryManager.getInstance();
    }
    get orb(): OrbManager {
        return OrbManager.getInstance();
    }
    get repository(): RepositoryManager {
        return RepositoryManager.getInstance();
    }
    get tFile(): TFileManager {
        return TFileManager.getInstance();
    }
    get useCase(): UseCaseManager {
        return UseCaseManager.getInstance();
    }
    get looks(): LooksManager {
        return LooksManager.getInstance();
    }
}

export const AM = new AppManager();
