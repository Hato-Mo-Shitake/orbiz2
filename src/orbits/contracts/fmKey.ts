import { AllFmKey, FmKeyForDailyLinkedNoteList, FmKeyForDate, FmKeyForImmutable, FmKeyForLinkedNote, FmKeyForLinkedNoteList, FmKeyForLogNote, FmKeyForMyNote, FmKeyForNote, FmKeyForNumber, FmKeyForRoleHub, FmKeyForStdLinkedNoteList, FmKeyForStdNote, FmKeyForString, FmKeyForStringList } from "../schema/frontmatters/FmKey";
import { NoteKind } from "./note-orb";

type NoteFmKeyMap = {
    my: FmKeyForMyNote;
    log: FmKeyForLogNote;
    std: FmKeyForStdNote;
    base: FmKeyForNote;
};
export type NoteFmKey<K extends NoteKind = "base"> = NoteFmKeyMap[K];

export type FmKeyMap = {
    immutable: FmKeyForImmutable,
    number: FmKeyForNumber
    string: FmKeyForString,
    date: FmKeyForDate,
    stringList: FmKeyForStringList,
    linkedNote: FmKeyForLinkedNote,
    stdLinkedNoteList: FmKeyForStdLinkedNoteList,
    roleHub: FmKeyForRoleHub,
    dailyLinkedNoteList: FmKeyForDailyLinkedNoteList,
    linkedNoteList: FmKeyForLinkedNoteList
    all: AllFmKey
};
export type FmKeyKind = keyof FmKeyMap;
export type FmKey<K extends FmKeyKind = "all"> = FmKeyMap[K];