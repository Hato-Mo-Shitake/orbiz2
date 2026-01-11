import z from "zod";

export const orbizSpaceTypeList = [
    "my",
    "test",
] as const;
export const OrbizSpaceTypeZEnum = z.enum(orbizSpaceTypeList);
export type OrbizSpaceType = z.infer<typeof OrbizSpaceTypeZEnum>;
export function isOrbizSpaceType(type: any): type is OrbizSpaceType {
    return OrbizSpaceTypeZEnum.safeParse(type).success;
}