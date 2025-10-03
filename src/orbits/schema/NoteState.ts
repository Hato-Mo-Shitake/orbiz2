import { MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { BaseFmOrb } from "src/core/orb-system/orbs/FmOrb";
import { createStore, StoreApi } from "zustand";
import { Note } from "../contracts/note-orb";
import { MyNoteAspect } from "./frontmatters/Aspect";
import { LogNoteStatus } from "./frontmatters/Status";

// ---- state の型定義 ----
export interface NoteMetadataState<T> {
    value: T;
    setValue: (newValue: T) => void;
}

export interface BaseNoteState {
    fmAttrTags: string[];
    setFmAttrTags: (tags: string[]) => void;
}
export interface StdNoteState extends BaseNoteState {
    fmAttrBelongsTo: StdNote[];
    setFmAttrBelongsTo: (notes: StdNote[]) => void;
    fmAttrRelatesTo: StdNote[];
    setFmAttrRelatesTo: (notes: StdNote[]) => void;
    fmAttrReferences: StdNote[];
    setFmAttrReferences: (notes: StdNote[]) => void;
    inLinkIds: string[],
    setInLinkIds: (inLinkIds: string[]) => void,
    outLinkIds: string[],
    setOutLinkIds: (outLinkIds: string[]) => void,
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
    fmAttrDue: Date | null,
    setFmAttrDue: (due: Date) => void,
    fmAttrResolved: Date | null,
    setFmAttrResolved: (resolved: Date) => void,
    fmAttrContext: string | null,
    setFmAttrContext: (context: string) => void,
}

export interface DiaryNoteState extends BaseNoteState {
    fmAttrIsClosed: boolean | null,
    setFmAttrIsClosed: (isClosed: boolean) => void,
    fmAttrScore: number | null,
    setFmAttrScore: (score: number) => void,
}

export interface DailyNoteState extends DiaryNoteState {
    fmAttrTheDay: Date | null,
    setFmAttrTheDay: (theDay: Date) => void,
    fmAttrCreatedNotes: StdNote[];
    setFmAttrCreatedNotes: (notes: StdNote[]) => void;
    fmAttrModifiedNotes: StdNote[];
    setFmAttrModifiedNotes: (notes: StdNote[]) => void;
    fmAttrResolvedNotes: StdNote[];
    setFmAttrResolvedNotes: (notes: StdNote[]) => void;
    fmAttrAmountSpent: number | null,
    setFmAttrAmountSpent: (amountSpent: number) => void,
    fmAttrTemplateDone: string[],
    setFmAttrTemplateDone: (templateDone: string[]) => void,
}

// ---- state ビルダー群 ----
function buildBaseNoteState<T extends BaseNoteState>(
    // fmOrb: BaseFmOrb,
    set: StoreApi<T>["setState"]
): BaseNoteState {
    return {
        // fmAttrTags: fmOrb.tags.value,
        fmAttrTags: [],
        setFmAttrTags: (tags: string[]) => set({ fmAttrTags: tags } as Partial<T>),
    };
}

function buildStdNoteState<T extends StdNoteState>(
    // fmOrb: StdFmOrb,
    // inLinkIds: string[],
    set: StoreApi<T>["setState"]
): StdNoteState {
    return {
        ...buildBaseNoteState(set),
        fmAttrBelongsTo: [],
        setFmAttrBelongsTo: (notes: Note[]) =>
            set({ fmAttrBelongsTo: notes } as Partial<T>),
        fmAttrRelatesTo: [],
        setFmAttrRelatesTo: (notes: Note[]) =>
            set({ fmAttrRelatesTo: notes } as Partial<T>),
        fmAttrReferences: [],
        setFmAttrReferences: (notes: Note[]) =>
            set({ fmAttrReferences: notes } as Partial<T>),
        inLinkIds: [],
        setInLinkIds: (inLinkIds: string[]) => set({ inLinkIds: inLinkIds } as Partial<T>),
        outLinkIds: [],
        setOutLinkIds: (outLinkIds: string[]) => set({ outLinkIds: outLinkIds } as Partial<T>)
    };
}

function buildMyNoteState<T extends MyNoteState>(
    // fmOrb: MyFmOrb,
    // inLinkIds: string[],
    set: StoreApi<T>["setState"]
): MyNoteState {
    return {
        ...buildStdNoteState(set),
        fmAttrRank: null,
        setFmAttrRank: (rank: number) => set({ fmAttrRank: rank } as Partial<T>),
        fmAttrCategories: [],
        setFmAttrCategories: (categories: string[]) => set({ fmAttrCategories: categories } as Partial<T>),
        fmAttrAliases: [],
        setFmAttrAliases: (aliases: string[]) => set({ fmAttrAliases: aliases } as Partial<T>),
        fmAttrAspect: null,
        setFmAttrAspect: (aspect: MyNoteAspect) => set({ fmAttrAspect: aspect } as Partial<T>),
        fmAttrRoleKind: null,
        setFmAttrRoleKind: (kind: string) => set({ fmAttrRoleKind: kind } as Partial<T>),
        fmAttrRoleHub: null,
        setFmAttrRoleHub: (note: MyNote) => set({ fmAttrRoleHub: note } as Partial<T>),
    };
}

function buildLogNoteState<T extends LogNoteState>(
    // fmOrb: LogFmOrb,
    // inLinkIds: string[],
    set: StoreApi<T>["setState"]
): LogNoteState {
    return {
        ...buildStdNoteState(set),
        fmAttrStatus: null,
        setFmAttrStatus: (status: LogNoteStatus) => set({ fmAttrStatus: status } as Partial<T>),
        fmAttrDue: null,
        setFmAttrDue: (due: Date) => set({ fmAttrDue: due } as Partial<T>),
        fmAttrResolved: null,
        setFmAttrResolved: (resolved: Date) => set({ fmAttrDue: resolved } as Partial<T>),
        fmAttrContext: null,
        setFmAttrContext: (context: string) => set({ fmAttrContext: context } as Partial<T>),
    };
}

function buildDiaryNoteState<T extends DiaryNoteState>(
    // fmOrb: BaseFmOrb,
    set: StoreApi<T>["setState"]
): DiaryNoteState {
    return {
        ...buildBaseNoteState(set),
        fmAttrIsClosed: null,
        setFmAttrIsClosed: (isClosed: boolean) => set({ fmAttrIsClosed: isClosed } as Partial<T>),
        fmAttrScore: null,
        setFmAttrScore: (score: number) => set({ fmAttrScore: score } as Partial<T>),
    };
}

function buildDailyNoteState<T extends DailyNoteState>(
    // fmOrb: BaseFmOrb,
    set: StoreApi<T>["setState"]
): DailyNoteState {
    return {
        ...buildDiaryNoteState(set),
        fmAttrTheDay: null,
        setFmAttrTheDay: (thaDay: Date) => set({ fmAttrTheDay: thaDay } as Partial<T>),
        fmAttrCreatedNotes: [],
        setFmAttrCreatedNotes: (notes: StdNote[]) => set({ fmAttrCreatedNotes: notes } as Partial<T>),
        fmAttrModifiedNotes: [],
        setFmAttrModifiedNotes: (notes: StdNote[]) => set({ fmAttrModifiedNotes: notes } as Partial<T>),
        fmAttrResolvedNotes: [],
        setFmAttrResolvedNotes: (notes: StdNote[]) => set({ fmAttrResolvedNotes: notes } as Partial<T>),
        fmAttrAmountSpent: null,
        setFmAttrAmountSpent: (amountSpent: number) => set({ fmAttrAmountSpent: amountSpent } as Partial<T>),
        fmAttrTemplateDone: [],
        setFmAttrTemplateDone: (templateDone: string[]) => set({ fmAttrTemplateDone: templateDone } as Partial<T>),

    };
}

// ---- create 関数 ----
export function createMyNoteState(): StoreApi<MyNoteState> {
    return createStore<MyNoteState>((set) => buildMyNoteState(set));
}
export function createLogNoteState(): StoreApi<LogNoteState> {
    return createStore<LogNoteState>((set) => buildLogNoteState(set));
}
export function createDailyNoteState(fmOrb: BaseFmOrb): StoreApi<DailyNoteState> {
    return createStore<DailyNoteState>((set) => buildDailyNoteState(set));
}