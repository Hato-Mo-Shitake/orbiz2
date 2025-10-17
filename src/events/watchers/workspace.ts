import OrbizPlugin from "main";
import { Workspace } from "obsidian";
import { AM } from "src/app/AppManager";
import { EventHandlerForWorkspace } from "../handlers/workspace";

export class WorkspaceEventWatcher {
    private get _OrbizPlugin(): OrbizPlugin {
        return AM.orbiz.plugin;
        // return AM.obsidian.OrbizPlugin;
        // return OAM().OrbizPlugin;
    }
    private get _workspace(): Workspace {
        return AM.obsidian.workspace;
        // return OAM().app.workspace;
    }

    public watchOnActiveLeafChange(callback: EventHandlerForWorkspace<"activeLeafChange">) {
        this._OrbizPlugin.registerEvent(this._workspace.on("active-leaf-change", callback));
    }
    public watchOnLayoutChange(callback: EventHandlerForWorkspace<"layoutChange">) {
        this._OrbizPlugin.registerEvent(this._workspace.on("layout-change", callback));
    }
    public watchOnFileOpen(callback: EventHandlerForWorkspace<"fileOpen">) {
        this._OrbizPlugin.registerEvent(this._workspace.on("file-open", callback))
    }
    public watchOnEditorChange(callback: EventHandlerForWorkspace<"editorChange">) {
        this._OrbizPlugin.registerEvent(this._workspace.on("editor-change", callback))
    }
}
