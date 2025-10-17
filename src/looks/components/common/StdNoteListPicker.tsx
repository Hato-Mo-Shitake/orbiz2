import { useEffect, useState } from "react";
import { AM } from "src/app/AppManager";
import { StdNote } from "src/core/domain/StdNote";
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

    useEffect(() => {
        // debugConsole("noteList", noteList);
        const noteNameList = noteList.map(n => n.baseName);
        // debugConsole("noteNameList", noteNameList);
        setNoteNameList(noteNameList);

        // 循環する。 
        // onChange([...noteList]);
    }, [noteList])

    // const handleAdd = (noteName: string): boolean => {
    //     if (!noteName) return false;
    //     if (noteList.some(note => note.name == noteName)) return false;

    //     const note = AM.note.getStdNoteByName(noteName);
    //     if (!note) return false;

    //     onChange([note, ...noteList]);
    //     return true;
    // }

    // const handleDelete = (noteName: string): boolean => {
    //     const result = noteList.filter(note => note.baseName != noteName);
    //     if (result.length === noteList.length) {
    //         return false;
    //     }
    //     onChange(result);
    //     return true;
    // }

    const handleChange = (labels: string[]) => {
        // setNoteNameList(labels);
        onChange(
            labels.map(name => AM.note.getStdNoteByName(name)!)
        );
    }

    // debugConsole("noteNameList", noteNameList);
    return (
        <div>
            <EditableItemList
                labels={noteNameList}
                onChange={handleChange}
                options={{
                    // onAdd: handleAdd,
                    // onDelete: handleDelete,
                    inputSuggestions: AM.note.allStdNoteNames,
                    inputPlaceholder: options?.placeholder
                }}
            />
        </div>
    )
}