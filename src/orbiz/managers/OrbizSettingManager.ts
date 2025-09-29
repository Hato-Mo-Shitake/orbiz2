import MyPlugin from "main";
import { OEM } from "./OrbizErrorManager";


interface MyPluginSettings {
    sampleSetting: string;
    categories: string[];
    roleKinds: string[];
}

export class OrbizSettingManager {
    private static _instance: OrbizSettingManager | null;

    static setInstance(myPlugin: MyPlugin) {
        OrbizSettingManager._instance = new OrbizSettingManager(myPlugin);
    }

    static getInstance(): OrbizSettingManager {
        const instance = OrbizSettingManager._instance;
        if (!instance) OEM.throwNotInitializedError();

        return instance;
    }

    private _defaultSettings: MyPluginSettings = {
        sampleSetting: 'default',
        categories: [],
        roleKinds: [],
    }
    private _unsavedSettings: MyPluginSettings;
    private _savedSettings: MyPluginSettings;
    private constructor(
        private readonly _myPlugin: MyPlugin
    ) { }

    async initialize() {
        await this.load();
    }

    get sampleSetting(): string {
        return this._savedSettings.sampleSetting;
    }

    get categories(): string[] {
        return this._savedSettings.categories;
    }

    get roleKinds(): string[] {
        return this._savedSettings.roleKinds;
    }

    setSampleSetting(setting: string) {
        const newSettings = this._unsavedSettings;
        newSettings.sampleSetting = setting;
        this._unsavedSettings = newSettings;
        // this._setSettings(newSettings);
    }

    setCategories(categories: string[]) {
        const newSettings = this._unsavedSettings;
        newSettings.categories = [...categories];
        this._unsavedSettings = newSettings;
    }

    setRoleKinds(roleKinds: string[]) {
        const newSettings = this._unsavedSettings;
        newSettings.roleKinds = [...roleKinds];
        this._unsavedSettings = newSettings;
    }

    async load() {
        // TODO： 
        this._unsavedSettings = Object.assign({}, this._defaultSettings, await this._myPlugin.loadData());
        this._savedSettings = structuredClone(this._unsavedSettings);
    }

    async save() {
        this._savedSettings = structuredClone(this._unsavedSettings);
        this._myPlugin.saveData(this._savedSettings);
    }

    // private _setSettings(settings: MyPluginSettings) {
    //     this._unsavedSettings = settings;
    // }
}

export const OSM = () => {
    return OrbizSettingManager.getInstance();
}