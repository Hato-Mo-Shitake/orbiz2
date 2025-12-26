import { ValueObjectError } from "../../common/domain-error";
import { VALUE_OBJECT_ERROR_MSG } from "../../common/domain-error.rules";

export const myNoteKindList = [
    "KNOWLEDGE",
    "WIP",
    "CREATORIUM",
    "GALLERY",
    "FAQ",
] as const;
export const logNoteKindList = [
    "TODO",
    "SCHEDULE",
    "MEMO",
    "NOTICE",
    "PLAN",
] as const;
export const stdNoteKindList = [
    ...myNoteKindList,
    ...logNoteKindList,
] as const;
export const diaryNoteKindList = [
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "YEARLY",
] as const;

export const allNoteKindList = [
    ...stdNoteKindList,
    ...diaryNoteKindList
] as const;

export type StdNoteKindCode = typeof stdNoteKindList[number];
export type MyNoteKindCode = typeof myNoteKindList[number];
export type LogNoteKindCode = typeof logNoteKindList[number];
export type DiaryNoteKindCode = typeof diaryNoteKindList[number];
export type NoteKindCode = typeof allNoteKindList[number];

export function validateNoteKind(value: string): asserts value is NoteKindCode {
    if (!(allNoteKindList as ReadonlyArray<string>).includes(value)) {
        throw new ValueObjectError(VALUE_OBJECT_ERROR_MSG.invalidValue, "NoteKind", value);
    }
}