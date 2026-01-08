import { NoteName } from "../../common/NoteName.vo";

const _brand = "StdNoteName";

function _validate(value: string): void {
    const segments = value.split('@');

    if (segments.length > 2) {
        throw new Error("Invalid StdNoteName value. More than two '@' symbols are not allowed.");
    }

    const coreName = segments[0];

    if (coreName === "") {
        throw new Error("Invalid StdNoteName value. CoreName must not be empty.");
    }

    const contextName = segments[1];

    if (contextName !== undefined && contextName === "") {
        throw new Error("Invalid StdNoteName value. ContextName must not be empty.");
    }
}

/**
 * 
 */
export class StdNoteName extends NoteName {
    private constructor(value: string) {
        _validate(value);
        super(value, _brand);
    }

    static from(value: string): StdNoteName {
        return new StdNoteName(value);
    }

    /**
     * @があるか否か
     */
    hasContext(): boolean {
        return this.getContextName() !== null;
    }

    /**
     * 
     * @returns 
     */
    getFullName(): string {
        return this._value;
    }

    /**
     * 
     * @returns 
     */
    getCoreName(): string {
        return this.segments[0];
    }

    /**
     * 
     * @returns 
     */
    getContextName(): string | null {
        return this.segments[1] ?? null;
    }

    private get segments(): [string, string?] {
        const [core, context] = this._value.split("@");
        return [core, context];
    }
}