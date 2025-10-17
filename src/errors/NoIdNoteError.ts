export class NoIdNoteError extends Error {
    constructor(path: string) {
        super(`no id note. path: ${path}`);
        this.name = "NoIdNoteError";
    }
}