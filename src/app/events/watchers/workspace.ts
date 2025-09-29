import MyPlugin from "main";
import { Workspace } from "obsidian";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { ActiveLeafChangeHandler, LayoutChangeHandler } from "../handlers/workspace";

export class WorkspaceEventWatcher {
    private get _myPlugin(): MyPlugin {
        return OAM().myPlugin;
    }
    private get _workspace(): Workspace {
        return OAM().app.workspace;
    }

    public watchOnActiveLeafChange(callback: ActiveLeafChangeHandler) {
        this._myPlugin.registerEvent(this._workspace.on("active-leaf-change", callback));
    }
    public watchOnLayoutChange(callback: LayoutChangeHandler) {
        this._myPlugin.registerEvent(this._workspace.on("layout-change", callback));
    }
}

