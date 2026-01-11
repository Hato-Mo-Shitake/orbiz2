import { NotInitializedError } from "src/errors/NotInitializedError";
import { DocumentEventWatcher } from "src/events/watchers/document";
import { IntervalEventWatcher } from "src/events/watchers/interval";
import { MetadataCacheEventWatcher } from "src/events/watchers/metadataCache";
import { UserEditEventWatcher } from "src/events/watchers/UserEditEventWatcher";
import { VaultEventWatcher } from "src/events/watchers/vault";
import { WorkspaceEventWatcher } from "src/events/watchers/workspace";


export class EventWatchManager {
    private static _instance: EventWatchManager | null = null;

    static setInstance(): void {
        this._instance = new EventWatchManager(
            new WorkspaceEventWatcher(),
            new VaultEventWatcher(),
            new MetadataCacheEventWatcher(),
            new UserEditEventWatcher(),
            new DocumentEventWatcher(),
            new IntervalEventWatcher(),
        );
    }

    static getInstance(): EventWatchManager {
        if (!this._instance) throw new NotInitializedError();

        return this._instance;
    }

    /** ------------ */

    private constructor(
        readonly workspaceWatcher: WorkspaceEventWatcher,
        readonly vaultWatcher: VaultEventWatcher,
        readonly metadataCacheWatcher: MetadataCacheEventWatcher,
        readonly userEditWatcher: UserEditEventWatcher,
        readonly documentWatcher: DocumentEventWatcher,
        readonly intervaleWatcher: IntervalEventWatcher,
    ) {
    }
}