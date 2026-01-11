import { useContext } from "react";
import { isMyNoteOrb, isStdNoteOrb, MyNoteOrb, NoteOrb, StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { NoteOrbContext } from "../context/NoteOrbContext";

export const useNoteOrb = (): NoteOrb | null | undefined => {
    return useContext(NoteOrbContext)
}

export const useStdNoteOrb = (): StdNoteOrb | null | undefined => {
    const noteOrb = useContext(NoteOrbContext);
    if (!isStdNoteOrb(noteOrb)) return null;
    return noteOrb;
}

export const useMyNoteOrb = (): MyNoteOrb | null | undefined => {
    const noteOrb = useContext(NoteOrbContext);
    if (!isMyNoteOrb(noteOrb)) return null;
    return noteOrb;
}

