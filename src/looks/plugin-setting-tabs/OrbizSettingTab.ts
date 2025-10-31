import OrbizPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { AM } from "src/app/AppManager";
import { isOrbizSpaceType } from "src/orbits/contracts/orbiz-space-type";

export class OrbizSettingTab extends PluginSettingTab {
    plugin: OrbizPlugin;

    constructor(app: App, plugin: OrbizPlugin) {
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
                .setValue(AM.orbizSetting.sampleSetting)
                // .setValue(this.plugin.settings.mySetting)
                .onChange(async (value) => {
                    AM.orbizSetting.setSampleSetting(value);
                    // this.plugin.settings.mySetting = value;
                    await AM.orbizSetting.save();
                    // await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Space type')
            .addDropdown((dropdown) =>
                dropdown
                    .addOption("my", "my space")
                    .addOption("test", "test space")
                    .setValue(AM.orbizSetting.spaceType)
                    .onChange(async (value) => {
                        if (!isOrbizSpaceType(value)) {
                            alert("invalid value");
                            return;
                        }
                        AM.orbizSetting.setSpaceType(value);
                        await AM.orbizSetting.save();
                    })
            );

        new Setting(containerEl)
            .setName('google gemini api key')
            .setDesc('Enter your api key')
            .addText(text => text
                .setPlaceholder('Enter your api key')
                .setValue(AM.orbizSetting.googleGeminiApiKey || "")
                .onChange(async (value) => {
                    AM.orbizSetting.setGoogleGeminiApiKey(value);
                    await AM.orbizSetting.save();
                }));

        new Setting(containerEl)
            .setName('enable google gemini')
            .setDesc('toggle google gemini')
            .addToggle(enable => enable
                .setValue(AM.orbizSetting.enableGoogleGemini)
                .onChange(async (enable) => {
                    AM.orbizSetting.setEnableGoogleGemini(enable);
                    await AM.orbizSetting.save();
                }));

        new Setting(containerEl)
            .setName('today closing evaluation google gemini additional info')
            .addTextArea(text => text
                .setPlaceholder('Enter prompt additional info')
                .setValue(AM.orbizSetting.todayClosingEvaluationGoogleGeminiAdditionalPrompt || "")
                .onChange(async (value) => {
                    AM.orbizSetting.setTodayClosingEvaluationGoogleGeminiAdditionalPrompt(value);
                    await AM.orbizSetting.save();
                }));
    }
}