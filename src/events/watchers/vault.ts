import OrbizPlugin from "main";
import { Vault } from "obsidian";
import { AM } from "src/app/AppManager";
import { EventHandlerForVault } from "../handlers/vault";

// export type TAbstractFileRenameHandler = (file: TAbstractFile, oldPath: string) => any;
// export type TAbstractFileDeleteHandler = (file: TAbstractFile) => any;

export class VaultEventWatcher {
    private get _OrbizPlugin(): OrbizPlugin {
        return AM.orbiz.plugin;
        // return AM.obsidian.OrbizPlugin;
        // return OAM().OrbizPlugin;
    }
    private get _vault(): Vault {
        return AM.obsidian.vault;
        // return OAM().app.vault;
    }

    public watchOnRename(callback: EventHandlerForVault<"rename">) {
        this._OrbizPlugin.registerEvent(this._vault.on("rename", callback));
    }
    public watchOnCreate(callback: EventHandlerForVault<"create">) {
        this._OrbizPlugin.registerEvent(this._vault.on("create", callback));
    }
    public watchOnModify(callback: EventHandlerForVault<"modify">) {
        this._OrbizPlugin.registerEvent(this._vault.on("modify", callback));
    }
}

