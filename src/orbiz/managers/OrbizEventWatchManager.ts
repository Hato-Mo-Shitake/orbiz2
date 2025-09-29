import { MetadataCacheEventWatcher } from "src/app/events/watchers/metadataCache";
import { UserEditEventWatcher } from "src/app/events/watchers/UserEditEventWatcher";
import { VaultEventWatcher } from "src/app/events/watchers/vault";
import { WorkspaceEventWatcher } from "src/app/events/watchers/workspace";
import { OEM } from "./OrbizErrorManager";

export class OrbizEventWatchManager {
    private static _instance: OrbizEventWatchManager | null = null;

    static setInstance(): void {
        this._instance = new OrbizEventWatchManager(
            new WorkspaceEventWatcher(),
            new VaultEventWatcher(),
            new MetadataCacheEventWatcher(),
            new UserEditEventWatcher
        );
    }

    static getInstance(): OrbizEventWatchManager {
        if (!this._instance) OEM.throwNotInitializedError(OrbizEventWatchManager);

        return this._instance;
    }

    /** ------------ */

    private constructor(
        // private readonly _register: EventRegistrar,
        readonly workspaceWatcher: WorkspaceEventWatcher,
        readonly vaultWatcher: VaultEventWatcher,
        readonly metadataCacheWatcher: MetadataCacheEventWatcher,
        readonly userEditWatcher: UserEditEventWatcher
    ) {
    }
}

export const OEwM = () => {
    return OrbizEventWatchManager.getInstance();
}