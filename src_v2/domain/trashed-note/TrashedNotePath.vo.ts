import { NotePath } from "../common/NotePath.vo";


const _brand = "TrashedNotePath.vo";

function _validate(value: string): void {
    const segments = value.split("/");

    if (segments[0] !== "____") {
        throw new Error("Invalid TrashedNotePath value: the 1st segment must be '____'.");
    }

    if (segments[1] !== "trash") {
        throw new Error("Invalid TrashedNotePath value: the 2nd segment must be 'trash'.");
    }
}

/**
 * ^[A-Za-z1-9]+-space/galaxies/StdNoteKind/yyyy形式の年/mm形式の月/ノート名$
 */
export class TrashedNotePath extends NotePath {
    /**
     * 
     * @param value 
     */
    private constructor(value: string) {
        super(value, _brand);
        _validate(value)
    }

    static isValidValue(value: string): boolean {
        try {
            _validate(value);
            return true;
        } catch (e) {
            return false;
        }
    }

    static from(value: string): TrashedNotePath {
        return new TrashedNotePath(value);
    }

    static tryFrom(value: string): TrashedNotePath | null {
        try {
            return TrashedNotePath.from(value);
        } catch (e) {
            return null;
        }
    }
}