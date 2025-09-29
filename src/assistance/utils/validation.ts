
// export class fmAttrValidator {
//     static tag(tag: string): boolean {
//         return !isHalfWidthNumber(tag);
//     }
//     static internalLink(link: string): boolean {
//         const path = extractLinkTarget(link);
//         // console.log(path);
//         if (!path) return false;
//         // 名前オンリーのリンクだとここで落ちるんだ。
//         return isVaultPath(path);
//     }
// }

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

// export function isVaultPath(input: string, ext: string = ".md"): boolean {
//     if (input.startsWith("/")) return false;
//     const parts = input.split("/");
//     // console.log("parts", parts);

//     // TODO: ルートパスに/を含めるか否か
//     if (parts[0] + "/" != OAM().rootDir) {
//         return false;
//     }

//     // 拡張子チェック
//     if (!input.endsWith(ext)) {
//         return false;
//     }

//     return true;
// }
