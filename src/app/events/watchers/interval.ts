import MyPlugin from "main";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { TimeAutoAndIntervalHandler } from "../handlers/interval";

export class IntervalEventWatcher {
    private get _myPlugin(): MyPlugin {
        return OAM().myPlugin;
    }

    public watch(timeAndHandler: TimeAutoAndIntervalHandler) {
        const [time, handler] = timeAndHandler;
        this._myPlugin.registerInterval(
            window.setInterval(handler, time)
        );
    }
}