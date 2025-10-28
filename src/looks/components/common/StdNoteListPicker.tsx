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
        const noteNameList = noteList.map(n => n.baseName);
        setNoteNameList(noteNameList);

        // 循環する。 
        // onChange([...noteList]);
    }, [noteList])


    const handleChange = (labels: string[]) => {
        onChange(
            labels.map(name => AM.note.getStdNoteByName(name)!)
        );
    }

    return (
        <div>
            <EditableItemList
                labels={noteNameList}
                onChange={handleChange}
                options={{
                    inputSuggestions: AM.note.allStdNoteNames,
                    inputPlaceholder: options?.placeholder
                }}
            />
        </div>
    )
}