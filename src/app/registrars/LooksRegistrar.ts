import { SampleSettingTab } from "src/looks/plugin-setting-tabs/SampleSettingTab";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { OUM } from "src/orbiz/managers/OrbizUseCaseManager";

export class LooksRegistrar {
    constructor() { }

    register(): void {
        const { app, myPlugin } = OAM();

        myPlugin.addRibbonIcon('dice', 'Activate view', () => {
            OUM().viewActivator.activateExampleView();
        });

        const statusBarItemEl = myPlugin.addStatusBarItem();
        statusBarItemEl.setText('Status Bar Text!');

        myPlugin.addSettingTab(new SampleSettingTab(app, myPlugin));
    }
}