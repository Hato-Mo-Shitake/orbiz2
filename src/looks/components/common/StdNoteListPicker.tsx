import { useState } from "react";
import { StdNote } from "src/core/domain/StdNote";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { EditableItemList } from "./EditableItemList";

export function StdNoteListPicker({
    noteList,
    onChange,
    options,
}: {
    noteList: StdNote[]
    onChange: (noteList: StdNote[]) => void,
    options?: {
        placeholder?: string,
    }
}) {
    const [noteNameList, setNoteNameList] = useState<string[]>(noteList.map(note => note.baseName));

    const handleAdd = (noteName: string): boolean => {
        if (!noteName) return false;
        if (noteList.some(note => note.name == noteName)) return false;

        const note = ONM().getStdNoteByName(noteName);
        if (!note) return false;

        onChange([note, ...noteList]);
        return true;
    }

    const handleDelete = (noteName: string): boolean => {
        const result = noteList.filter(note => note.baseName != noteName);
        if (result.length === noteList.length) {
            return false;
        }
        onChange(result);
        return true;
    }
    return (
        <div>
            <EditableItemList
                labels={noteNameList}
                onChange={setNoteNameList}
                options={{
                    onAdd: handleAdd,
                    onDelete: handleDelete,
                    inputSuggestions: ONM().allStdNoteNames,
                    inputPlaceholder: options?.placeholder
                }}
            />
        </div>
    )
}