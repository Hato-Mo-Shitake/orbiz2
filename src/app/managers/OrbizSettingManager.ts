import OrbizPlugin from "main";
import { debugConsole } from "src/assistance/utils/debug";
import { NotInitializedError } from "src/errors/NotInitializedError";
import { OrbizSpaceType } from "src/orbits/contracts/orbiz-space-type";

interface OrbizPluginSettings {
    sampleSetting: string;
    spaceType: OrbizSpaceType;
    categories: string[];
    roleKinds: string[];
    templateDone: string[];
}

export class OrbizSettingManager {
    private static _instance: OrbizSettingManager | null;

    static setInstance(OrbizPlugin: OrbizPlugin) {
        OrbizSettingManager._instance = new OrbizSettingManager(OrbizPlugin);
    }

    static getInstance(): OrbizSettingManager {
        const instance = OrbizSettingManager._instance;
        if (!instance) throw new NotInitializedError();
        // OEM.throwNotInitializedError();

        return instance;
    }

    private _defaultSettings: OrbizPluginSettings = {
        sampleSetting: 'default',
        spaceType: "my",
        categories: [],
        roleKinds: [],
        templateDone: [],
    }
    private _unsavedSettings: OrbizPluginSettings;
    private _savedSettings: OrbizPluginSettings;
    private constructor(
        private readonly _OrbizPlugin: OrbizPlugin
    ) { }

    async initialize() {
        await this.load();
    }

    get sampleSetting(): string {
        return this._savedSettings.sampleSetting;
    }
    get spaceType(): OrbizSpaceType {
        return this._savedSettings.spaceType;
    }
    get categories(): string[] {
        return this._savedSettings.categories;
    }
    get roleKinds(): string[] {
        return this._savedSettings.roleKinds;
    }
    get templateDone(): string[] {
        return this._savedSettings.templateDone;
    }

    setSampleSetting(setting: string) {
        const newSettings = structuredClone(this._savedSettings);
        newSettings.sampleSetting = setting;
        this._unsavedSettings = newSettings;
        // this._setSettings(newSettings);
    }
    setSpaceType(type: "my" | "test") {
        const newSettings = structuredClone(this._savedSettings);
        newSettings.spaceType = type;
        this._unsavedSettings = newSettings;
    }
    setCategories(categories: string[]) {
        const newSettings = structuredClone(this._savedSettings);
        newSettings.categories = [...categories];
        this._unsavedSettings = newSettings;
    }
    setRoleKinds(roleKinds: string[]) {
        const newSettings = structuredClone(this._savedSettings);
        newSettings.roleKinds = [...roleKinds];
        this._unsavedSettings = newSettings;
    }
    setTemplateDone(templateDone: string[]) {
        const newSettings = structuredClone(this._savedSettings);
        newSettings.templateDone = [...templateDone];
        this._unsavedSettings = newSettings;
    }

    async load() {
        this._unsavedSettings = Object.assign({}, this._defaultSettings, await this._OrbizPlugin.loadData());
        this._savedSettings = structuredClone(this._unsavedSettings);
    }

    async save() {
        const preSpaceType = this.spaceType;
        this._savedSettings = structuredClone(this._unsavedSettings);
        await this._OrbizPlugin.saveData(this._savedSettings);

        if (this.spaceType != preSpaceType) {

            // やっぱりなんか色々と怪しいな。
            const plugin = this._OrbizPlugin;
            plugin.load();
            debugConsole(`OrbizSpaceType: ${preSpaceType} -> ${this.spaceType}`);
        }
    }
}