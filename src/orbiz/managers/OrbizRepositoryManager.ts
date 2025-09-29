import { NoteRepository } from "src/repository/NoteRepository";
import { OEM } from "./OrbizErrorManager";

export class OrbizRepositoryManager {
    private static _instance: OrbizRepositoryManager | null;

    static setInstance() {
        this._instance = new OrbizRepositoryManager(
            new NoteRepository()
        );
    }

    static getInstance(): OrbizRepositoryManager {
        if (!this._instance) OEM.throwNotInitializedError();
        return this._instance;
    }

    private constructor(
        public readonly noteR: NoteRepository
    ) { }
}

export const ORM = () => {
    return OrbizRepositoryManager.getInstance();
}