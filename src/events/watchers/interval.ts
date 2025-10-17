import OrbizPlugin from "main";
import { AM } from "src/app/AppManager";
import { TimeAutoAndIntervalHandler } from "../handlers/interval";

export class IntervalEventWatcher {
    private get _OrbizPlugin(): OrbizPlugin {
        // return AM.obsidian.OrbizPlugin;
        return AM.orbiz.plugin;
        // return OAM().OrbizPlugin;
    }

    public watch(timeAndHandler: TimeAutoAndIntervalHandler) {
        const [time, handler] = timeAndHandler;
        this._OrbizPlugin.registerInterval(
            window.setInterval(handler, time)
        );
    }
}