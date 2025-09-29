import { TFile } from "obsidian";
import { NotInitializedError } from "src/errors/NotInitializedError";
import { ErrorAttrs } from "src/orbits/contracts/error";

export class OEM {
    // pushする前に、[]を代入しないとエラーになる。
    private static readonly errorList: Record<string, string[]>

    static throwUnexpectedError(): never {
        this.reportUnexpectedError();
        throw new Error();
    }

    static reportUnexpectedError(): void {
        const message = `unexpected error. `;
        console.error(message);
        // this.errorList["unexpectedError"].push(message);
    }

    static throwNotInitializedError(attrs?: ErrorAttrs): never {
        // TODO: ここに、エラーの記録などを取るロジックを記述。
        throw new NotInitializedError(attrs);
    }

    static throwNotImplementedError(attrs?: ErrorAttrs): never {
        throw new Error(`${attrs?.name} is not implemented error.`);
    }

    static reportMissingNoteId(filePath: string): void {
        const message = `missing note id. path: ${filePath}`;
        console.error(message);
        // this.errorList["missingNoteId"].push(message);
    }

    static reportNoteIdConflict(id: string, filePath: string): void {
        const message = `note id conflict: id. ${id}, path: ${filePath}`;
        console.error(message);
        // this.errorList["noteIdConflict"].push(message);
    }

    static reportFileNameConflict(name: string, filePath: string): void {
        const message = `file name conflict: name. ${name}, path: ${filePath}`;
        console.error(message);
        // this.errorList["fileNameConflict"].push(message);
    }

    static reportNoIdTFile(tFile: TFile): void {
        const message = `no id tFile. path: ${tFile.path} `
        console.error(message);
        // this.errorList["noIdTFile"].push(message);
    }

    static throwNoIdNote(filePath: string): never {
        this.reportNoIdNote(filePath);
        throw new Error();
    }
    static reportNoIdNote(filePath: string): void {
        const message = `no id note. path: ${filePath} `
        console.error(message);
        // this.errorList["noIdNote"].push(message);
    }

    static reportNothingSource(filePath: string): void {
        const message = `nothing note source. path: ${filePath} `
        console.error(message);
        // this.errorList["nothingNoteSource"].push(message);
    }

    static reportNoteIdInvalid(tFile: TFile): void {
        const message = `note id invalid. path: ${tFile.path} `
        console.error(message);
        // this.errorList["noteIdInvalid"].push(message);
    }
} 