import { AM } from "src/app/AppManager";

export function debugConsole(...args: any[]): void {
    if (AM.orbizSetting.spaceType === "test") {
        console.log(...args);
    }
}