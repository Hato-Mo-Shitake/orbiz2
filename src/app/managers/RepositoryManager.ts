import { NotInitializedError } from "src/errors/NotInitializedError";
import { NoteRepository } from "src/repository/NoteRepository";

export class RepositoryManager {
    private static _instance: RepositoryManager | null;

    static setInstance() {
        this._instance = new RepositoryManager(
            new NoteRepository()
        );
    }

    static getInstance(): RepositoryManager {
        if (!this._instance) throw new NotInitializedError();
        return this._instance;
    }

    private constructor(
        public readonly noteR: NoteRepository
    ) { }
}