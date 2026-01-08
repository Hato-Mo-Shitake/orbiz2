export function recordValues<T>(obj: Record<string, T>): T[] {
    return Object.values(obj);
}