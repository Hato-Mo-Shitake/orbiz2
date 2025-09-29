import { createContext } from "react";
import { NoteOrb } from "src/core/orb-system/orbs/NoteOrb";

export const NoteOrbContext = createContext<NoteOrb | null | undefined>(undefined);