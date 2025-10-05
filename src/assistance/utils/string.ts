export function findSubstringRange(target: string, search: string): { start: number; end: number } | null {
    const start = target.indexOf(search);
    if (start === -1) return null;
    return { start, end: start + search.length };
}