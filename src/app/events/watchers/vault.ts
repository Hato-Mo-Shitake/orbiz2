import MyPlugin from "main";
import { TAbstractFile, Vault } from "obsidian";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export type TAbstractFileRenameHandler = (file: TAbstractFile, oldPath: string) => any;
export type TAbstractFileDeleteHandler = (file: TAbstractFile) => any;

export class VaultEventWatcher {
    private get _myPlugin(): MyPlugin {
        return OAM().myPlugin;
    }
    private get _vault(): Vault {
        return OAM().app.vault;
    }

    public watchOnRename(callback: TAbstractFileRenameHandler) {
        this._myPlugin.registerEvent(this._vault.on("rename", callback));
    }
}

