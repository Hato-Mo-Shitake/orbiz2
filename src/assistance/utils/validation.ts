export function isStringArray(value: unknown): value is string[] {
    return (
        Array.isArray(value) &&
        value.every((item) => typeof item === "string")
    );
}

export function isDateString(value: unknown): value is string {
    return typeof value === "string" && !isNaN(Date.parse(value));
}

export function isInternalLink(value: unknown): value is string {
    return typeof value === "string" && /^\[\[[^\[\]]+\]\]$/.test(value);
}

export function isHalfWidthNumber(str: string): boolean {
    return /^[0-9]+$/.test(str);
}

export function isLiteral<T extends string>(str: string, literal: T): str is T {
    return str === literal;
}

export function isValidDate(d: Date): boolean {
    return d instanceof Date && !isNaN(d.getTime());
}

export function isNullOrUndefined(value: unknown): boolean {
    return (value === null || value === undefined);
}