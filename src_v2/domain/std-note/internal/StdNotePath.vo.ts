import { UnexpectedDomainError } from "../../common/domain-error";
import { NotePath } from "../../common/NotePath.vo";
import { validateStdNoteKindValue } from "./std-note.rules";
import { StdNoteName } from "./StdNoteName.vo";

const _brand = "StdNotePath";

function _validate(value: string): void {
    const segments = value.split("/");

    if (segments[1] !== "galaxies") {
        throw new Error("Invalid StdNotePath value: the 2nd segment must be 'galaxies'.");
    }

    try {
        validateStdNoteKindValue(segments[2])
    } catch (e) {
        console.error(e);
        throw new Error("Invalid StdNotePath value: the 3rd segment must be StdNoteKindCode.");
    }

    if (!/^\d{4}$/.test(segments[3])) {
        throw new Error("Invalid StdNotePath value: the 4th segment must be year in YYYY format.");
    }
    if (![
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"
    ].includes(segments[4])) {
        throw new Error("Invalid StdNotePath value: the 5th segment must be month in mm format.");
    }
}

/**
 * ^[A-Za-z1-9]+-space/galaxies/StdNoteKind/yyyy形式の年/mm形式の月/ノート名$
 */
export class StdNotePath extends NotePath {
    /**
     * 
     * @param value 
     */
    private constructor(value: string) {
        super(value, _brand);
        _validate(value)
    }

    static from(value: string): StdNotePath {
        return new StdNotePath(value);
    }

    static tryFrom(value: string): StdNotePath | null {
        try {
            return StdNotePath.from(value);
        } catch (e) {
            return null;
        }
    }

    getNoteName(): StdNoteName {
        const segments = this._value.split("/");
        const last = segments.at(-1)!;

        if (!last.endsWith(".md")) {
            throw new UnexpectedDomainError("The '.md' extension is guaranteed by the inheritance chain: MarkdownFilePath.");
        }

        const noteNameValue = last.slice(0, -3);
        return StdNoteName.from(noteNameValue);
    }

    toString(): string {
        return this._value;
    }
}