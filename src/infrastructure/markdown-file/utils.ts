export function extractFrontmatterBlock(
    content: string
): string | null {
    if (!content.startsWith("---")) return null;

    const end = content.indexOf("\n---", 3);
    if (end === -1) return null;

    return content.slice(3, end).trim();
}