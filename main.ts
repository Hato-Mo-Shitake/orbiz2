import { MarkdownView, Plugin } from 'obsidian';
import { AppInitializer } from 'src/app/AppInitializer';
import { AM } from 'src/app/AppManager';
import { debugConsole } from 'src/assistance/utils/debug';

export default class OrbizPlugin extends Plugin {
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
		await AM.diary.writeDailyLogNoteIds();
	}

	private async initializeApp(): Promise<void> {
		const appInitializer = new AppInitializer(
			this.app,
			this
		);

		await appInitializer.initialize();
		// const activeFile = AM.tFile.activeTFile;
		const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!mdView) return;
		debugConsole("最初のマウント");
		const leaves = this.app.workspace.getLeavesOfType("markdown");
		leaves.forEach(leaf => {
			if (!(leaf.view instanceof MarkdownView)) return;

			const mdView = leaf.view;
			// if (tFile.path !== mdView.file?.path) return;

			AM.looks.mountOrUpdateNoteTopSection(mdView);
		});
		debugConsole("最初のマウント完了");
		// debugConsole("最初に開かれているノート！", activeFile?.path);
	}
}
