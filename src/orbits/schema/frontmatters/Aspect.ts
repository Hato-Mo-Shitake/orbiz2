import z from "zod";

export const myNoteAspectList = [
    "default",
    "index",
] as const;
export const MyNoteAspectZEnum = z.enum(myNoteAspectList);
export type MyNoteAspect = z.infer<typeof MyNoteAspectZEnum>;
export function isMyNoteAspect(aspect: any): aspect is MyNoteAspect {
    return MyNoteAspectZEnum.safeParse(aspect).success;
}