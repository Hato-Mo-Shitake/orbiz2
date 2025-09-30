import MyPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { isOrbizSpaceType } from "src/orbits/contracts/orbiz-space-type";
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

        new Setting(containerEl)
            .setName('Space type')
            .addDropdown((dropdown) =>
                dropdown
                    .addOption("my", "my space")
                    .addOption("test", "test space")
                    .setValue(OSM().spaceType)
                    .onChange(async (value) => {
                        if (!isOrbizSpaceType(value)) {
                            alert("invalid value");
                            return;
                        }
                        OSM().setSpaceType(value);
                        await OSM().save();
                    })
            );
    }
}