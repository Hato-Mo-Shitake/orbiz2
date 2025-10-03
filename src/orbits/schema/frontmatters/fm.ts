import { z } from "zod";

export const BaseFmZObj = z.object({
    type: z.string(),
    id: z.string(),
    tags: z.array(z.string()).nullable(),
});
export type BaseFm = z.infer<typeof BaseFmZObj>;
export function isBaseFm(fm: any): fm is BaseFm {
    return BaseFmZObj.safeParse(fm).success;
}

export const StdFmZObj = BaseFmZObj.extend({
    subType: z.string(),
    belongsTo: z.array(z.string()).nullable(),
    relatesTo: z.array(z.string()).nullable(),
    references: z.array(z.string()).nullable(),
});
export type StdFm = z.infer<typeof StdFmZObj>;
export function isStdFm(fm: any): fm is StdFm {
    return StdFmZObj.safeParse(fm).success;
}

export const MyFmZObj = StdFmZObj.extend({
    rank: z.number().nullable(),
    categories: z.array(z.string()).nullable(),
    aliases: z.array(z.string()).nullable(),
    aspect: z.string().nullable(),
    roleKind: z.string().nullable(),
    roleHub: z.string().nullable(),
})
export type MyFm = z.infer<typeof MyFmZObj>;
export function isMyFm(fm: any): fm is MyFm {
    return MyFmZObj.safeParse(fm).success;
}

export const LogFmZObj = StdFmZObj.extend({
    status: z.string().nullable(),
    due: z.number().nullable(),
    resolved: z.number().nullable(),
    context: z.string().nullable(),
});
export type LogFm = z.infer<typeof LogFmZObj>;
export function isLogFm(fm: any): fm is LogFm {
    return LogFmZObj.safeParse(fm).success;
}

export const DiaryFmZObj = BaseFmZObj.extend({
    subType: z.string(),
    score: z.number().nullable(),
    isClosed: z.boolean().nullable(),
});
export type DiaryFm = z.infer<typeof DiaryFmZObj>;
export function isDiaryFm(fm: any): fm is DiaryFm {
    return DiaryFmZObj.safeParse(fm).success;
}

export const DailyFmZObj = DiaryFmZObj.extend({
    theDay: z.number().nullable(), // タイムスタンプ（ms）
    createdNotes: z.array(z.string()).nullable(),
    modifiedNotes: z.array(z.string()).nullable(),
    resolvedNotes: z.array(z.string()).nullable(),
    amountSpent: z.number().nullable(),
    templateDone: z.array(z.string()).nullable(),
});
export type DailyFm = z.infer<typeof DailyFmZObj>;
export function isDailyFm(fm: any): fm is DailyFm {
    return DailyFmZObj.safeParse(fm).success;
}

export const WeeklyFmZObj = DiaryFmZObj.extend({
    weekEndDay: z.number().nullable(),
});
export type WeeklyFm = z.infer<typeof WeeklyFmZObj>;
export function isWeeklyFm(fm: any): fm is WeeklyFm {
    return WeeklyFmZObj.safeParse(fm).success;
}

export const MonthlyFmZObj = DiaryFmZObj.extend({
    monthEndDay: z.number().nullable(),
});
export type MonthlyFm = z.infer<typeof MonthlyFmZObj>;
export function isMonthlyFm(fm: any): fm is MonthlyFm {
    return MonthlyFmZObj.safeParse(fm).success;
}

export const YearlyFmZObj = DiaryFmZObj.extend({
    yearEndDay: z.number().nullable(),
});
export type YearlyFm = z.infer<typeof YearlyFmZObj>;
export function isYearlyFm(fm: any): fm is YearlyFm {
    return YearlyFmZObj.safeParse(fm).success;
}
