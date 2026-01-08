import { useState } from "react";
import { SelectBox } from "./SelectBox";

export function SelectableItemList({
    selectedList,
    onChange,
    selections,
    options
}: {
    selectedList: string[]
    onChange: (selectedList: string[]) => void,
    selections: string[],
    options?: {
        onAdd?: (label: string) => boolean,
        onDelete?: (label: string) => boolean,
        validationMsgOnAdd?: string,
        validationMsgOnDelete?: string,
        defaultSelected?: string[]
    }
}) {
    const [input, setInput] = useState(selections[0]);
    const handleAdd = (input: string) => {
        for (const selected of selectedList) {
            if (selected == input) {
                alert("already exist.");
                return;
            }
        }

        if (options?.onAdd && !options.onAdd?.(input)) {
            const msg = options?.validationMsgOnAdd || "validation error onAdd.";
            alert(msg);
            return;
        }

        onChange([input, ...selectedList]);
    }

    const handleDelete = (deletedSelect: string) => {
        if (options?.onDelete && !options.onDelete?.(deletedSelect)) {
            const msg = options?.validationMsgOnDelete || "validation error onDelete.";
            alert(msg);
            return;
        }

        onChange(selectedList.filter(selected => selected != deletedSelect));
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                <button onClick={() => handleAdd(input)}>追加</button>
                <SelectBox
                    value={input}
                    options={selections}
                    onChange={setInput}
                />
            </div>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {selectedList.map(selected => {
                    return (
                        <li key={selected} style={{ display: "flex", gap: "0.5em", alignItems: "center" }}>
                            <button onClick={() => handleDelete(selected)}>削除</button>
                            <span>- {selected}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}