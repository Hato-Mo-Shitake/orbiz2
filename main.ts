import { MarkdownView, Plugin } from 'obsidian';
import { AppInitializer } from 'src/app/AppInitializer';
import { debugConsole } from 'src/assistance/utils/debug';
import { ODM } from 'src/orbiz/managers/OrbizDiaryManager';
import { OVM } from 'src/orbiz/managers/OrbizViewManager';

export default class MyPlugin extends Plugin {
	async onload() {
		if (!this.app.workspace.layoutReady) {
			this.app.workspace.onLayoutReady(async () => {
				await this.initializeApp();

			});
		} else {
			await this.initializeApp();
		}
		// なんでここでOSMを呼べないんだ？
		// debugConsole("orbiz initialized");
	}

	onunload() {
		alert("unload");
	}

	async saveProgress() {
		await ODM().writeDailyLogNoteIds();
	}

	private async initializeApp(): Promise<void> {
		const appInitializer = new AppInitializer(
			this.app,
			this
		);

		await appInitializer.initialize();
		// const activeFile = OTM().activeTFile;
		const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!mdView) return;
		debugConsole("最初のマウント");
		OVM().mountOrUpdateNoteTopSection(mdView);
		debugConsole("最初のマウント完了");
		// debugConsole("最初に開かれているノート！", activeFile?.path);
	}
}
