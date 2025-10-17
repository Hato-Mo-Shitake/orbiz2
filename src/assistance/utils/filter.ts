
// export class fmAttrFilter {
//     static internalLink(link: string): string | null {
//         if (fmAttrValidator.internalLink(link)) return link;
//         if (isVaultPath(link)) return `[[${link}]]`;
//         if (!link.includes("/")) {
//             const map = AM.cache.fileNameToIdMap;
//             const noteId = map.get(link);
//             if (!noteId) return null;
//             const source = AM.cache.getStdNoteSourceById(noteId);
//             if (!source) return null;

//             const parts = source.path.split("/");

//             const filtered = parts.map(sanitizeFileName).join("/");

//             return `[[${filtered}]]`;
//         }
//         return null;
//     }
// }

export function trimFull(str: string): string {
    return str.replace(/^[\s\u3000]+|[\s\u3000]+$/g, "");
}

export function extractLinkTarget(str: string): string | null {
    const match = str.match(/^\[\[([^|\]]+)(?:\|[^\]]*)?\]\]$/);
    return match ? match[1] : null;
}

export function sanitizeFileName(input: string): string {
    return input
        .replace(/[/\\?%*:|"<>]/g, '-')      // Windows 禁止文字をハイフンに変換
        .replace(/[\u0000-\u001F]/g, '')     // 制御文字を除去
        .replace(/\s+/g, '_')                // スペースをアンダースコアに変換（任意）
        .replace(/^\.+/, '')                 // 先頭のドットを除去
        .replace(/\.+$/, '');                // 末尾のドットを除去
}