import { OEwM } from "src/orbiz/managers/OrbizEventWatchManager";
import { EventHandlersForDocument } from "../events/handlers/document";
import { EventHandlersForInterval } from "../events/handlers/interval";
import { EventHandlersForMetadataCache } from "../events/handlers/metadataCache";
import { EventHandlersForVault } from "../events/handlers/vault";
import { EventHandlersForWorkspace } from "../events/handlers/workspace";

export class EventRegistrar {
    register(): void {
        /** workspace */
        EventHandlersForWorkspace.activeLeafChange.forEach(handle => {
            OEwM().workspaceWatcher.watchOnActiveLeafChange(handle);
        });
        EventHandlersForWorkspace.layoutChange.forEach(handle => {
            OEwM().workspaceWatcher.watchOnLayoutChange(handle);
        });
        EventHandlersForWorkspace.fileOpen.forEach(handle => {
            OEwM().workspaceWatcher.watchOnFileOpen(handle);
        });
        EventHandlersForWorkspace.editorChange.forEach(handle => {
            OEwM().workspaceWatcher.watchOnEditorChange(handle);
        });

        /** vault */
        EventHandlersForVault.rename.forEach(handle => {
            OEwM().vaultWatcher.watchOnRename(handle);
        });

        EventHandlersForVault.create.forEach(handle => {
            OEwM().vaultWatcher.watchOnCreate(handle);
        });

        EventHandlersForVault.modify.forEach(handle => {
            OEwM().vaultWatcher.watchOnModify(handle);
        });

        /** metadataCache */
        EventHandlersForMetadataCache.changed.forEach(handle => {
            OEwM().metadataCacheWatcher.watchOnCacheChanged(handle);
        });


        /** document */
        // myPlugin.registerDomEvent(document, 'click', (evt: MouseEvent) => {
        //     console.log('click!!', evt);
        // });
        EventHandlersForDocument.click.forEach(handle => {
            OEwM().documentWatcher.watchOnClick(handle);
        });

        /** interval */
        // myPlugin.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
        EventHandlersForInterval.forEach(handler => {
            OEwM().intervaleWatcher.watch(handler);
        })
    }
}