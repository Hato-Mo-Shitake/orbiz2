export function extractNoteNameFromInternalLink(link: string): string | null {
    const match = link.match(/\[\[(?:.*\/)?([^/|\]]+)(?:\|.*)?\]\]/);
    if (!match) return null;

    const fileName = match[1];
    if (fileName.endsWith(".md")) {
        return fileName.slice(0, - 3);
    }
    return fileName;
}

export function extractInternalLinks(text: string): string[] {
    const pattern = /\[\[[^\]]+\]\]/g;
    const matches = [];
    let match;

    while ((match = pattern.exec(text)) !== null) {
        matches.push(match[0]);
    }

    return matches;
}