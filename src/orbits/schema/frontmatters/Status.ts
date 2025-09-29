import z from "zod";

export const logNoteStatusList = [
    "default",
    "done",
    "must",
    "onHold",
    "lowPriority"
] as const;
export const LogNoteStatusZEnum = z.enum(logNoteStatusList);
export type LogNoteStatus = z.infer<typeof LogNoteStatusZEnum>;
export function isLogNoteStatus(aspect: any): aspect is LogNoteStatus {
    return LogNoteStatusZEnum.safeParse(aspect).success;
}