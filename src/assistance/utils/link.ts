export function extractNoteNameFromInternalLink(link: string): string | null {
    const match = link.match(/\[\[(?:.*\/)?([^/|\]]+)(?:\|.*)?\]\]/);
    if (!match) return null;

    const fileName = match[1];
    if (fileName.endsWith(".md")) {
        return fileName.slice(0, - 3);
    }
    return fileName;
}