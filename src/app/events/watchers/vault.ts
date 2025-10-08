import MyPlugin from "main";
import { Vault } from "obsidian";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { EventHandlerForVault } from "../handlers/vault";

// export type TAbstractFileRenameHandler = (file: TAbstractFile, oldPath: string) => any;
// export type TAbstractFileDeleteHandler = (file: TAbstractFile) => any;

export class VaultEventWatcher {
    private get _myPlugin(): MyPlugin {
        return OAM().myPlugin;
    }
    private get _vault(): Vault {
        return OAM().app.vault;
    }

    public watchOnRename(callback: EventHandlerForVault<"rename">) {
        this._myPlugin.registerEvent(this._vault.on("rename", callback));
    }
    public watchOnCreate(callback: EventHandlerForVault<"create">) {
        this._myPlugin.registerEvent(this._vault.on("create", callback));
    }
    public watchOnModify(callback: EventHandlerForVault<"modify">) {
        this._myPlugin.registerEvent(this._vault.on("modify", callback));
    }
}

