import { z } from "zod";

export const stdNoteTypeList = [
    "myNote",
    "logNote",
] as const;
export const StdNoteTypeZEnum = z.enum(stdNoteTypeList);
export type StdNoteType = z.infer<typeof StdNoteTypeZEnum>;
export function isStdNoteType(type: any): type is StdNoteType {
    return StdNoteTypeZEnum.safeParse(type).success;
}

export const diaryNoteTypeList = [
    "daily",
    "weekly",
    "monthly",
    "yearly"
] as const;
export const DiaryNoteTypeZEnum = z.enum(diaryNoteTypeList);
export type DiaryNoteType = z.infer<typeof DiaryNoteTypeZEnum>;
export function isDiaryNoteType(type: any): type is DiaryNoteType {
    return DiaryNoteTypeZEnum.safeParse(type).success;
}

export const noteTypeList = [
    ...stdNoteTypeList,
    "diaryNote",
] as const;
export const NoteTypeZEnum = z.enum(noteTypeList);
export type NoteType = z.infer<typeof NoteTypeZEnum>;
export function isNoteType(type: any): type is NoteType {
    return NoteTypeZEnum.safeParse(type).success;
}

export const myNoteTypeList = [
    "knowledge",
    "wip",
    "creatorium",
    "gallery",
    "faq"
] as const;
export const MyNoteTypeZEnum = z.enum(myNoteTypeList);
export const MyNoteTypes = MyNoteTypeZEnum.Enum;
export type MyNoteType = z.infer<typeof MyNoteTypeZEnum>;
export function isMyNoteType(type: any): type is MyNoteType {
    return MyNoteTypeZEnum.safeParse(type).success;
}

export const logNoteTypeList = [
    "todo",
    "schedule",
    "memo",
    "notice",
    "plan"
] as const;
export const LogNoteTypeZEnum = z.enum(logNoteTypeList);
export const LogNoteTypes = LogNoteTypeZEnum.Enum;
export type LogNoteType = z.infer<typeof LogNoteTypeZEnum>;
export function isLogNoteType(type: any): type is LogNoteType {
    return LogNoteTypeZEnum.safeParse(type).success;
}

export const subNoteTypeList = [
    ...myNoteTypeList,
    ...logNoteTypeList
] as const;
export const SubNoteTypeZEnum = z.enum(subNoteTypeList);
export const SubNoteTypes = SubNoteTypeZEnum.Enum;
export type SubNoteType = z.infer<typeof SubNoteTypeZEnum>;
export function isSubNoteType(type: any): type is SubNoteType {
    return SubNoteTypeZEnum.safeParse(type).success;
}

export const ConcNoteTypeList = [
    ...subNoteTypeList
] as const;
export const ConcNoteTypeZEnum = z.enum(ConcNoteTypeList);
export const ConcNoteTypes = ConcNoteTypeZEnum.Enum;
export type ConcNoteType = z.infer<typeof SubNoteTypeZEnum>;
export function isConcNoteType(type: any): type is SubNoteType {
    return ConcNoteTypeZEnum.safeParse(type).success;
}

