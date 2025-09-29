import { LogNote } from "src/core/domain/LogNote";
import { MyNote } from "src/core/domain/MyNote";
import { BaseNote } from "src/core/domain/Note";
import { StdNote } from "src/core/domain/StdNote";
import { BaseNoteOrb, LogNoteOrb, MyNoteOrb, StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { LogNoteEditor } from "src/core/orb-system/services/editors/LogNoteEditor";
import { MyNoteEditor } from "src/core/orb-system/services/editors/MyNoteEditor";
import { BaseNoteEditor } from "src/core/orb-system/services/editors/NoteEditor";
import { StdNoteEditor } from "src/core/orb-system/services/editors/StdNoteEditor";
import { LogNoteReader } from "src/core/orb-system/services/readers/LogNoteReader";
import { MyNoteReader } from "src/core/orb-system/services/readers/MyNoteReader";
import { BaseNoteReader } from "src/core/orb-system/services/readers/NoteReader";
import { StdNoteReader } from "src/core/orb-system/services/readers/StdNoteReader";
import { LogNoteViewer } from "src/core/orb-system/services/viewers/LogNoteViewer";
import { MyNoteViewer } from "src/core/orb-system/services/viewers/MyNoteViewer";
import { BaseNoteViewer } from "src/core/orb-system/services/viewers/NoteViewer";
import { StdNoteViewer } from "src/core/orb-system/services/viewers/StdNoteViewer";

export type NoteKind = "base" | "std" | "my" | "log"

export type Note<K extends NoteKind = "base">
    = K extends "my" ? MyNote
    : K extends "log" ? LogNote
    : K extends "std" ? StdNote
    : K extends "base" ? BaseNote
    : never;

export type NoteReader<K extends NoteKind = "base">
    = K extends "my" ? MyNoteReader
    : K extends "log" ? LogNoteReader
    : K extends "std" ? StdNoteReader
    : K extends "base" ? BaseNoteReader
    : never;
export type NoteEditor<K extends NoteKind = "base">
    = K extends "my" ? MyNoteEditor
    : K extends "log" ? LogNoteEditor
    : K extends "std" ? StdNoteEditor
    : K extends "base" ? BaseNoteEditor
    : never;
export type NoteViewer<K extends NoteKind = "base">
    = K extends "my" ? MyNoteViewer
    : K extends "log" ? LogNoteViewer
    : K extends "std" ? StdNoteViewer
    : K extends "base" ? BaseNoteViewer
    : never;

export type NoteOrb<K extends NoteKind = "base">
    = K extends "my" ? MyNoteOrb
    : K extends "log" ? LogNoteOrb
    : K extends "std" ? StdNoteOrb
    : K extends "base" ? BaseNoteOrb
    : never;  
