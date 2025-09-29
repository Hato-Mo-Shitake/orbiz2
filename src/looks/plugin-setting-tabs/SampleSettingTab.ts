import MyPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { OSM } from "src/orbiz/managers/OrbizSettingManager";

export class SampleSettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Setting #1')
            .setDesc('It\'s a secret!!!')
            .addText(text => text
                .setPlaceholder('Enter your secret')
                .setValue(OSM().sampleSetting)
                // .setValue(this.plugin.settings.mySetting)
                .onChange(async (value) => {
                    OSM().setSampleSetting(value);
                    // this.plugin.settings.mySetting = value;
                    await OSM().save();
                    // await this.plugin.saveSettings();
                }));
    }
}