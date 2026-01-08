import { z } from "zod";

// TODO: これ、StdNoteSourceにして、Diary用は別口で作るか？
// Diaryは作らなくてもいい説ある。
const StdNoteSourceZObj = z.object({
    id: z.string().uuid(),
    path: z.string(),
    inLinkIds: z.set(z.string().uuid()),
    outLinkIds: z.set(z.string().uuid()),
    unCacheInitialized: z.boolean().optional(),
})
// export type NoteSource = z.infer<typeof StdNoteSourceZObj>;
export type StdNoteSource = z.infer<typeof StdNoteSourceZObj>;

export function isStdNoteSource(noteSource: any): noteSource is StdNoteSource {
    return StdNoteSourceZObj.safeParse(noteSource).success;
}