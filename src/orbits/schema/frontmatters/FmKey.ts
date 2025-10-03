import z from "zod";
export type FmValue = string | number | boolean | string[] | number[];

const id = "id" as const;
const tags = "tags" as const;
const type = "type" as const;
export const fmKeysForNote = [
    type,
    id,
    tags,
] as const;
export type FmKeyForNote = typeof fmKeysForNote[number];

const subType = "subType" as const;
const rank = "rank" as const;
const roleKind = "roleKind" as const;
const roleHub = "roleHub" as const;
const aspect = "aspect" as const;
const belongsTo = "belongsTo" as const;
const relatesTo = "relatesTo" as const;
const references = "references" as const;
export const fmKeysForJustStdNote = [
    subType,
    belongsTo,
    relatesTo,
    references
] as const;
export const fmKeysForStdNote = [
    ...fmKeysForNote,
    ...fmKeysForJustStdNote
] as const;
export type FmKeyForStdNote = typeof fmKeysForStdNote[number];

const aliases = "aliases" as const;
const categories = "categories" as const;

export const fmKeysForJustMyNote = [
    rank,
    aliases,
    categories,
    aspect,
    roleKind,
    roleHub,
] as const;
export const fmKeysForMyNote = [
    ...fmKeysForStdNote,
    ...fmKeysForJustMyNote
] as const;
export type FmKeyForMyNote = typeof fmKeysForMyNote[number];

const status = "status" as const;
const due = "due" as const;
const resolved = "resolved" as const;
const context = "context" as const;
export const fmKeysForJustLogNote = [
    status,
    due,
    resolved,
    context
] as const;
export const fmKeysForLogNote = [
    ...fmKeysForStdNote,
    ...fmKeysForJustLogNote
] as const;
export type FmKeyForLogNote = typeof fmKeysForLogNote[number];

const score = "score" as const;
const isClosed = "isClosed" as const;
export const fmKeysForJustDiaryNote = [
    score,
    isClosed
] as const;
export const fmKeysForDiaryNote = [
    ...fmKeysForNote,
    ...fmKeysForJustDiaryNote
] as const;
export type FmKeyForDiaryNote = typeof fmKeysForDiaryNote[number];

const theDay = "theDay" as const;
const createdNotes = "createdNotes" as const;
const modifiedNotes = "modifiedNotes" as const;
const resolvedNotes = "resolvedNotes" as const;
const amountSpent = "amountSpent" as const;
const templateDone = "templateDone" as const;
export const fmKeysForJustDailyNote = [
    theDay,
    createdNotes,
    modifiedNotes,
    resolvedNotes,
    amountSpent,
    templateDone
] as const;
export const fmKeysForDailyNote = [
    ...fmKeysForDiaryNote,
    ...fmKeysForJustDailyNote
] as const;
export type FmKeyForDailyNote = typeof fmKeysForDailyNote[number];

export const allFmKeys = [
    ...fmKeysForNote,
    ...fmKeysForJustStdNote,
    ...fmKeysForJustMyNote,
    ...fmKeysForJustLogNote,
    ...fmKeysForJustDiaryNote,
    ...fmKeysForJustDailyNote
] as const;
export type AllFmKey = typeof allFmKeys[number];

/** ------------------------------------------- */


export const fmKeysForImmutable = [
    id,
    type,
    subType
];
export type FmKeyForImmutable = typeof fmKeysForImmutable[number];
export type EditableFmKey<TFmKey> = Extract<TFmKey, FmKeyForImmutable>;

// export const fmKeysForBool = [
// ] as const;
// export type FmKeyForBool = typeof fmKeysForBool[number];

export const fmKeysForNumber = [
    rank,
    score
] as const;
export type FmKeyForNumber = typeof fmKeysForNumber[number];

export const fmKeysForString = [
    id,
    type,
    subType,
    roleKind,
    roleHub,
    aspect,
    status,
    context,
] as const;
export type FmKeyForString = typeof fmKeysForString[number];

export const ZodStringList = z.array(z.string());
export type StringList = z.infer<typeof ZodStringList>;
export const fmKeysForStringList = [
    tags,
    aliases,
    categories,
    belongsTo,
    relatesTo,
    references,
] as const;
export type FmKeyForStringList = typeof fmKeysForStringList[number];


// export const fmKeysForInternalLinkList = [
//     belongsTo,
//     relatesTo,
//     references,
// ] as const;
// export type FmKeyForInternalLinkList = typeof fmKeysForInternalLinkList[number];

// export const fmKeysForInternalLinkSingle = [
//     roleHub,
// ];
// export type FmKeyForInternalLinkSingle = typeof fmKeysForInternalLinkSingle[number];

export const fmKeysForStdLinkedNoteList = [
    belongsTo,
    relatesTo,
    references,
] as const;
export type FmKeyForStdLinkedNoteList = typeof fmKeysForStdLinkedNoteList[number];

export type FmKeyForRoleHub = typeof roleHub;

export const fmKeysForDailyLinkedNoteList = [
    createdNotes,
    modifiedNotes,
    resolvedNotes
] as const;
export type FmKeyForDailyLinkedNoteList = typeof fmKeysForDailyLinkedNoteList[number];

export const fmKeysForLinkedNoteList = [
    ...fmKeysForStdLinkedNoteList,
    roleHub,
    ...fmKeysForDailyLinkedNoteList
] as const;
export type FmKeyForLinkedNoteList = typeof fmKeysForLinkedNoteList[number];

export const fmKeysForLinkedNote = [
    roleHub,
];
export type FmKeyForLinkedNote = typeof fmKeysForLinkedNote[number];

// export const fmKeysForInternalLink = [
//     ...fmKeysForInternalLinkList,
//     ...fmKeysForInternalLinkSingle
// ];
// export type FmKeyForInternalLink = typeof fmKeysForInternalLink[number];

export const fmKeysDate = [
    due,
    resolved,
    theDay,
] as const;
export type FmKeyForDate = typeof fmKeysDate[number];
