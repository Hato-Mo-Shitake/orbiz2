import { useState } from "react";
import { trimFull } from "src/assistance/utils/filter";
import { StdNote } from "src/core/domain/StdNote";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { AutoSuggestInput } from "./AutoSuggestInput";


export function StdNotePicker({
    onChange,
    options
}: {
    onChange: (note: StdNote | null) => void,
    options?: {
        defaultNote?: StdNote,
        suggestions?: string[],
    }
}) {
    const [noteName, setNoteName] = useState<string>(options?.defaultNote?.baseName || "");

    const _createNote = (noteName: string): StdNote | null => {
        if (!noteName) return null;
        return ONM().getStdNoteByName(noteName);
    }
    const handleChange = (noteName: string) => {
        const name = trimFull(noteName);
        setNoteName(name);
        const note = _createNote(name);
        if (!note) return null;
        onChange(note);
    };

    return (
        <AutoSuggestInput
            input={noteName}
            onChange={handleChange}
            suggestions={options?.suggestions || ONM().allStdNoteNames}
            onSelect={handleChange}
            onEnter={handleChange}
            placeholder={options?.defaultNote?.baseName}
        />
    );
}