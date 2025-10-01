import { MyNote } from "src/core/domain/MyNote";
import { BaseFmOrb, LogFmOrb, MyFmOrb, StdFmOrb } from "src/core/orb-system/orbs/FmOrb";
import { create, StoreApi } from "zustand";
import { Note } from "../contracts/note-orb";
import { MyNoteAspect } from "./frontmatters/Aspect";
import { LogNoteStatus } from "./frontmatters/Status";

// ---- state の型定義 ----
export interface BaseNoteState {
    fmAttrTags: string[];
    setFmAttrTags: (tags: string[]) => void;
}
export interface StdNoteState extends BaseNoteState {
    fmAttrBelongsTo: Note[];
    setFmAttrBelongsTo: (notes: Note[]) => void;
    fmAttrRelatesTo: Note[];
    setFmAttrRelatesTo: (notes: Note[]) => void;
    fmAttrReferences: Note[];
    setFmAttrReferences: (notes: Note[]) => void;
    inLinkIds: string[],
    setInLinkIds: (inLinkIds: string[]) => void,
}
export interface MyNoteState extends StdNoteState {
    fmAttrRank: number | null,
    setFmAttrRank: (rank: number) => void,
    fmAttrCategories: string[],
    setFmAttrCategories: (categories: string[]) => void,
    fmAttrAliases: string[],
    setFmAttrAliases: (aliases: string[]) => void,
    fmAttrAspect: MyNoteAspect | null,
    setFmAttrAspect: (aspect: MyNoteAspect) => void,
    fmAttrRoleKind: string | null,
    setFmAttrRoleKind: (kind: string) => void,
    fmAttrRoleHub: MyNote | null;
    setFmAttrRoleHub: (hub: MyNote) => void;
}
export interface LogNoteState extends StdNoteState {
    fmAttrStatus: LogNoteStatus | null,
    setFmAttrStatus: (status: LogNoteStatus) => void,
}

// TODO: あとで直して
export interface DailyNoteState extends BaseNoteState {
}

// ---- state ビルダー群 ----
function buildBaseNoteState<T extends BaseNoteState>(
    fmOrb: BaseFmOrb,
    set: StoreApi<T>["setState"]
): BaseNoteState {
    return {
        fmAttrTags: fmOrb.tags.value,
        setFmAttrTags: (tags: string[]) => set({ fmAttrTags: tags } as Partial<T>),
    };
}

function buildStdNoteState<T extends StdNoteState>(
    fmOrb: StdFmOrb,
    inLinkIds: string[],
    set: StoreApi<T>["setState"]
): StdNoteState {
    return {
        ...buildBaseNoteState(fmOrb, set),
        fmAttrBelongsTo: fmOrb.belongsTo.value,
        setFmAttrBelongsTo: (notes: Note[]) =>
            set({ fmAttrBelongsTo: notes } as Partial<T>),
        fmAttrRelatesTo: fmOrb.relatesTo.value,
        setFmAttrRelatesTo: (notes: Note[]) =>
            set({ fmAttrRelatesTo: notes } as Partial<T>),
        fmAttrReferences: fmOrb.references.value,
        setFmAttrReferences: (notes: Note[]) =>
            set({ fmAttrReferences: notes } as Partial<T>),
        inLinkIds: inLinkIds,
        setInLinkIds: (inLinkIds: string[]) =>
            set({ inLinkIds: inLinkIds } as Partial<T>)
    };
}

function buildMyNoteState<T extends MyNoteState>(
    fmOrb: MyFmOrb,
    inLinkIds: string[],
    set: StoreApi<T>["setState"]
): MyNoteState {
    return {
        ...buildStdNoteState(fmOrb, inLinkIds, set),
        fmAttrRank: fmOrb.rank.value,
        setFmAttrRank: (rank: number) => set({ fmAttrRank: rank } as Partial<T>),
        fmAttrCategories: fmOrb.categories.value,
        setFmAttrCategories: (categories: string[]) => set({ fmAttrCategories: categories } as Partial<T>),
        fmAttrAliases: fmOrb.aliases.value,
        setFmAttrAliases: (aliases: string[]) => set({ fmAttrAliases: aliases } as Partial<T>),
        fmAttrAspect: fmOrb.aspect.value,
        setFmAttrAspect: (aspect: MyNoteAspect) => set({ fmAttrAspect: aspect } as Partial<T>),
        fmAttrRoleKind: fmOrb.aspect.value,
        setFmAttrRoleKind: (kind: string) => set({ fmAttrRoleKind: kind } as Partial<T>),
        fmAttrRoleHub: fmOrb.roleHub.value,
        setFmAttrRoleHub: (note: MyNote) => set({ fmAttrRoleHub: note } as Partial<T>),
    };
}

function buildLogNoteState<T extends LogNoteState>(
    fmOrb: LogFmOrb,
    inLinkIds: string[],
    set: StoreApi<T>["setState"]
): LogNoteState {
    return {
        ...buildStdNoteState(fmOrb, inLinkIds, set),
        fmAttrStatus: fmOrb.status.value,
        setFmAttrStatus: (status: LogNoteStatus) => set({ fmAttrStatus: status } as Partial<T>)
    };
}

function buildDailyNoteState<T extends DailyNoteState>(
    fmOrb: BaseFmOrb,
    set: StoreApi<T>["setState"]
): DailyNoteState {
    return {
        ...buildBaseNoteState(fmOrb, set),
    };
}

// ---- create 関数 ----
export function createMyNoteState(fmOrb: MyFmOrb, inLinkIds: string[]): StoreApi<MyNoteState> {
    return create<MyNoteState>((set) => buildMyNoteState(fmOrb, inLinkIds, set));
}
export function createLogNoteState(fmOrb: LogFmOrb, inLinkIds: string[]): StoreApi<LogNoteState> {
    return create<LogNoteState>((set) => buildLogNoteState(fmOrb, inLinkIds, set));
}
export function createDailyNoteState(fmOrb: BaseFmOrb): StoreApi<DailyNoteState> {
    return create<DailyNoteState>((set) => buildDailyNoteState(fmOrb, set));
}