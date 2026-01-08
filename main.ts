import { MarkdownView, Plugin } from 'obsidian';
import { AppInitializer } from './src_old/app/AppInitializer';
import { AM } from './src_old/app/AppManager';

export default class OrbizPlugin extends Plugin {
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
		alert("unload");
	}

	async saveProgress() {
	}

	private async initializeApp(): Promise<void> {
		const appInitializer = new AppInitializer(
			this.app,
			this
		);

		await appInitializer.initialize();
		const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!mdView) return;
		const leaves = this.app.workspace.getLeavesOfType("markdown");
		leaves.forEach(leaf => {
			if (!(leaf.view instanceof MarkdownView)) return;

			const mdView = leaf.view;

			AM.looks.mountOrUpdateNoteTopSection(mdView);
		});
	}
}
