import { Plugin } from 'obsidian';
import { AppInitializer } from 'src/app/AppInitializer';
import { ODM } from 'src/orbiz/managers/OrbizDiaryManager';

export default class MyPlugin extends Plugin {
	async onload() {
		if (!this.app.workspace.layoutReady) {
			this.app.workspace.onLayoutReady(async () => {
				await this.initializeApp();
			});
		} else {
			await this.initializeApp();
		}
	}

	onunload() {
		alert("onunload");
	}

	async saveProgress() {
		await ODM().writeDailyLogNoteIds();
	}

	private async initializeApp(): Promise<void> {
		const appInitializer = new AppInitializer(
			this.app,
			this
		);

		appInitializer.initialize();
	}
}
