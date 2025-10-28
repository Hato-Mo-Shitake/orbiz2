import { NoteCreator } from "src/app/use-cases/NoteCreator";
import { NoteSoftDeleter } from "src/app/use-cases/NoteSoftDeleter";
import { Prompt } from "src/app/use-cases/Prompt";
import { ViewActivator } from "src/app/use-cases/ViewActivator";
import { NotInitializedError } from "src/errors/NotInitializedError";

export class UseCaseManager {
    private static _instance: UseCaseManager | null;

    static setInstance(): void {
        UseCaseManager._instance = new UseCaseManager(
            new ViewActivator(),
            new NoteCreator(),
            new NoteSoftDeleter(),
            new Prompt(),
        );
    }

    static getInstance(): UseCaseManager {
        const instance = UseCaseManager._instance;
        if (!instance) throw new NotInitializedError();

        return instance;
    }

    private constructor(
        public readonly viewActivator: ViewActivator,
        public readonly noteCreator: NoteCreator,
        public readonly noteSoftDeleter: NoteSoftDeleter,
        public readonly prompt: Prompt,
    ) { }
}