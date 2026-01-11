import { EventHandlersForDocument } from "../../events/handlers/document";
import { EventHandlersForInterval } from "../../events/handlers/interval";
import { EventHandlersForMetadataCache } from "../../events/handlers/metadataCache";
import { EventHandlersForVault } from "../../events/handlers/vault";
import { EventHandlersForWorkspace } from "../../events/handlers/workspace";
import { AM } from "../AppManager";

export class EventRegistrar {
    register(): void {
        /** workspace */
        EventHandlersForWorkspace.activeLeafChange.forEach(handle => {
            AM.eventWatch.workspaceWatcher.watchOnActiveLeafChange(handle);
        });
        EventHandlersForWorkspace.layoutChange.forEach(handle => {
            AM.eventWatch.workspaceWatcher.watchOnLayoutChange(handle);
        });
        EventHandlersForWorkspace.fileOpen.forEach(handle => {
            AM.eventWatch.workspaceWatcher.watchOnFileOpen(handle);
        });
        EventHandlersForWorkspace.editorChange.forEach(handle => {
            AM.eventWatch.workspaceWatcher.watchOnEditorChange(handle);
        });

        /** vault */
        EventHandlersForVault.rename.forEach(handle => {
            AM.eventWatch.vaultWatcher.watchOnRename(handle);
        });

        EventHandlersForVault.create.forEach(handle => {
            AM.eventWatch.vaultWatcher.watchOnCreate(handle);
        });

        EventHandlersForVault.modify.forEach(handle => {
            AM.eventWatch.vaultWatcher.watchOnModify(handle);
        });

        /** metadataCache */
        EventHandlersForMetadataCache.changed.forEach(handle => {
            AM.eventWatch.metadataCacheWatcher.watchOnCacheChanged(handle);
        });


        /** document */
        // OrbizPlugin.registerDomEvent(document, 'click', (evt: MouseEvent) => {
        //     console.log('click!!', evt);
        // });
        EventHandlersForDocument.click.forEach(handle => {
            AM.eventWatch.documentWatcher.watchOnClick(handle);
        });

        /** interval */
        // OrbizPlugin.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
        EventHandlersForInterval.forEach(handler => {
            AM.eventWatch.intervaleWatcher.watch(handler);
        })
    }
}