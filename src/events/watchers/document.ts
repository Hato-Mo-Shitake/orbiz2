import OrbizPlugin from "main";
import { AM } from "src/app/AppManager";
import { EventHandlerForDocument } from "../handlers/document";

export class DocumentEventWatcher {
    private get _OrbizPlugin(): OrbizPlugin {
        return AM.orbiz.plugin;
    }

    public watchOnClick(callback: EventHandlerForDocument<"click">) {
        this._OrbizPlugin.registerDomEvent(document, "click", callback);
    }
}