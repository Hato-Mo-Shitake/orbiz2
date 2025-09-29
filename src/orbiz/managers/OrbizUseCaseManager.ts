import { NoteCreator } from "src/use-cases/NoteCreator";
import { NoteSoftDeleter } from "src/use-cases/NoteSoftDeleter";
import { Prompt } from "src/use-cases/Prompt";
import { ViewActivator } from "src/use-cases/ViewActivator";
import { OEM } from "./OrbizErrorManager";

export class OrbizUseCaseManager {
    private static _instance: OrbizUseCaseManager | null;

    static setInstance(): void {
        OrbizUseCaseManager._instance = new OrbizUseCaseManager(
            new ViewActivator(),
            new NoteCreator(),
            new NoteSoftDeleter(),
            new Prompt(),
            // new UserEditEventWatcher(),
        );
    }

    static getInstance(): OrbizUseCaseManager {
        const instance = OrbizUseCaseManager._instance;
        if (!instance) OEM.throwNotInitializedError();

        return instance;
    }

    private constructor(
        public readonly viewActivator: ViewActivator,
        public readonly noteCreator: NoteCreator,
        public readonly noteSoftDeleter: NoteSoftDeleter,
        public readonly prompt: Prompt,
        // public readonly userEditWatcher: UserEditEventWatcher,
    ) { }
}

export const OUM = () => {
    return OrbizUseCaseManager.getInstance();
}