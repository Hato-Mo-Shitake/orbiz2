import MyPlugin from "main";
import { Workspace } from "obsidian";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { EventHandlerForWorkspace } from "../handlers/workspace";

export class WorkspaceEventWatcher {
    private get _myPlugin(): MyPlugin {
        return OAM().myPlugin;
    }
    private get _workspace(): Workspace {
        return OAM().app.workspace;
    }

    public watchOnActiveLeafChange(callback: EventHandlerForWorkspace<"activeLeafChange">) {
        this._myPlugin.registerEvent(this._workspace.on("active-leaf-change", callback));
    }
    public watchOnLayoutChange(callback: EventHandlerForWorkspace<"layoutChange">) {
        this._myPlugin.registerEvent(this._workspace.on("layout-change", callback));
    }
    public watchOnFileOpen(callback: EventHandlerForWorkspace<"fileOpen">) {
        this._myPlugin.registerEvent(this._workspace.on("file-open", callback))
    }
    public watchOnEditorChange(callback: EventHandlerForWorkspace<"editorChange">) {
        this._myPlugin.registerEvent(this._workspace.on("editor-change", callback))
    }
}

