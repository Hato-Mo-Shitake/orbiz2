
export const myNoteKindValueList = [
    "KNOWLEDGE",
    "WIP",
    "CREATORIUM",
    "GALLERY",
    "FAQ",
] as const;
export const logNoteKindValueList = [
    "TODO",
    "SCHEDULE",
    "MEMO",
    "NOTICE",
    "PLAN",
] as const;
export const stdNoteKindValueList = [
    ...myNoteKindValueList,
    ...logNoteKindValueList,
] as const;

// export const diaryNoteKindList = [
//     "DAILY",
//     "WEEKLY",
//     "MONTHLY",
//     "YEARLY",
// ] as const;

// export const allNoteKindList = [
//     ...stdNoteKindList,
//     ...diaryNoteKindList
// ] as const;

export type StdNoteKindValue = typeof stdNoteKindValueList[number];
export type MyNoteKindValue = typeof myNoteKindValueList[number];
export type LogNoteKindValue = typeof logNoteKindValueList[number];
// export type DiaryNoteKindValue = typeof diaryNoteKindList[number];
// export type NoteKindValue = typeof allNoteKindList[number];

export function validateStdNoteKindValue(value: string): asserts value is StdNoteKindValue {
    if (!(stdNoteKindValueList as ReadonlyArray<string>).includes(value)) {
        throw new Error("invalid StdNoteKindValue. value:" + value);
    }
}

// export type OutlinkStdNoteIdListValue = {
//     parent: StdNoteId[]
//     relating: StdNoteId[]
//     referencing: StdNoteId[]
// }

// export type InlinkStdNoteIdListValue = {
//     child: StdNoteId[]
//     related: StdNoteId[]
//     referenced: StdNoteId[]
// }

// export type StdNoteFrontmatter = {
//     id: StdNoteId,
//     tags: TagName[],
//     kind: StdNoteKind,
//     belongsTo: StdNoteId[],
//     relateTo: StdNoteId[],
//     references: StdNoteId[],
// }
