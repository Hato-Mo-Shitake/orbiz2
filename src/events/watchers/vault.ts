import OrbizPlugin from "main";
import { Vault } from "obsidian";
import { AM } from "src/app/AppManager";
import { EventHandlerForVault } from "../handlers/vault";

export class VaultEventWatcher {
    private get _OrbizPlugin(): OrbizPlugin {
        return AM.orbiz.plugin;
    }
    private get _vault(): Vault {
        return AM.obsidian.vault;
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

