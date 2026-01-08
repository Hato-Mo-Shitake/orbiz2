import { isMyNote, MyNote } from "src/core/domain/MyNote";
import { isStdNote, StdNote } from "src/core/domain/StdNote";
import z from "zod";
import { MyNoteAspectZEnum } from "../schema/frontmatters/Aspect";
import { fmKeysForStdLinkedNoteList } from "../schema/frontmatters/FmKey";
import { LogNoteTypeZEnum, MyNoteTypeZEnum, SubNoteTypeZEnum } from "../schema/frontmatters/NoteType";
import { LogNoteStatusZEnum } from "../schema/frontmatters/Status";

export const linkedNoteDirectionList = [
    "in",
    "out"
] as const;
const LinkedNoteDirectionZObj = z.enum(linkedNoteDirectionList);
export type LinkedNoteDirection = z.infer<typeof LinkedNoteDirectionZObj>;

const LinkedNoteConfZObj = z.object({
    rootNote: z.custom<StdNote>((note) => isStdNote(note)),
    direction: LinkedNoteDirectionZObj,
    key: z.enum(fmKeysForStdLinkedNoteList),
});
export type LinkedNoteConf = z.infer<typeof LinkedNoteConfZObj>;
export function isLinkedNoteConf(conf: any): conf is LinkedNoteConf {
    return LinkedNoteConfZObj.safeParse(conf).success;
}
// export type LinkedNoteConf = {
//     rootNoteId: string,
//     direction: LinkedNoteDirection,
//     key: FmKey<"linkedNoteList">,
// }

const RoleNodeConfZObj = z.object({
    kind: z.string(),
    hub: z.custom<MyNote>((note) => isMyNote(note)),
});
export type RoleNodeConf = z.infer<typeof RoleNodeConfZObj>
export function isRoleNodeConf(conf: any): conf is RoleNodeConf {
    return RoleNodeConfZObj.safeParse(conf).success;
}
// export type RoleNodeConf = {
//     roleKind: string,
//     roleHub: string,
// };

const NewStdNoteConfZObj = z.object({
    baseName: z.string(),
    subType: SubNoteTypeZEnum,
    linkedConf: LinkedNoteConfZObj.nullable().optional(),
});
export type NewStdNoteConf = z.infer<typeof NewStdNoteConfZObj>;
export function isNewStdNoteConf(conf: any): conf is NewStdNoteConf {
    return NewStdNoteConfZObj.safeParse(conf).success;
}
// export type NewStdNoteConf = {
//     baseName: string,
//     subType: SubNoteType,
//     linkedConf?: LinkedNoteConf,
// };
const NewMyNoteConfZObj = NewStdNoteConfZObj.extend({
    subType: MyNoteTypeZEnum,
    roleNodeConf: RoleNodeConfZObj.nullable().optional(),
    aspect: MyNoteAspectZEnum.nullable().optional(),
    categories: z.array(z.string()).nullable().optional(),
})
export type NewMyNoteConf = z.infer<typeof NewMyNoteConfZObj>;
export function isNewMyNoteConf(conf: any): conf is NewMyNoteConf {
    return NewMyNoteConfZObj.safeParse(conf).success;
}
// export type NewMyNoteConf = NewStdNoteConf & {
//     subType: MyNoteType,
//     roleNodeConf?: RoleNodeConf,
//     aspect?: string, // TODO: type作りたい
//     categories?: string[],
// }
const NewLogNoteConfZObj = NewStdNoteConfZObj.extend({
    subType: LogNoteTypeZEnum,
    status: LogNoteStatusZEnum.nullable().optional(),
    due: z.date().nullable().optional(),
    context: z.string().nullable().optional(),
})
export type NewLogNoteConf = z.infer<typeof NewLogNoteConfZObj>;
export function isNewLogNoteConf(conf: any): conf is NewLogNoteConf {
    return NewLogNoteConfZObj.safeParse(conf).success;
}
// export type NewLogNoteConf = NewStdNoteConf & {
//     subType: LogNoteType,
//     status?: string, // TODO: type 作りたい
//     due?: number,
//     context?: string,
// }