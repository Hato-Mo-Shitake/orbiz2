import MyPlugin from "main";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { EventHandlerForDocument } from "../handlers/document";

export class DocumentEventWatcher {
    private get _myPlugin(): MyPlugin {
        return OAM().myPlugin;
    }

    public watchOnClick(callback: EventHandlerForDocument<"click">) {
        this._myPlugin.registerDomEvent(document, "click", callback);
    }
}