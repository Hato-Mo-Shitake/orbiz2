import { OAM } from "src/orbiz/managers/OrbizAppManager";

const isDebug = true;
export function debugConsole(...args: any[]): void {
    if (isDebug && !OAM().isProd) {
        console.log(...args);
    }
}