import { OSM } from "src/orbiz/managers/OrbizSettingManager";

export function debugConsole(...args: any[]): void {
    if (OSM().spaceType === "test") {
        console.log(...args);
    }
}