import { SampleSettingTab } from "src/looks/plugin-setting-tabs/SampleSettingTab";
import { AM } from "../AppManager";

export class LooksRegistrar {
    register(): void {
        const { app } = AM.obsidian;
        const { plugin } = AM.orbiz;

        plugin.addRibbonIcon('dice', 'Activate view', () => {
            AM.useCase.viewActivator.activateExampleView();
        });

        const statusBarItemEl = plugin.addStatusBarItem();
        statusBarItemEl.setText('Status Bar Text!');

        plugin.addSettingTab(new SampleSettingTab(app, plugin));
    }
}