import { Fragment, useState } from "react";
import { trimFull } from "src/assistance/utils/filter";
import { AutoSuggestInput } from "./AutoSuggestInput";

export function EditableItemList({
    labels,
    onChange,
    options
}: {
    labels: string[],
    onChange: (labels: string[]) => void,
    options?: {
        onAdd?: (label: string) => boolean,
        onDelete?: (label: string) => boolean,
        validationMsgOnAdd?: string,
        validationMsgOnDelete?: string,
        inputSuggestions?: string[]
        inputPlaceholder?: string
    }
}) {
    const [input, setInput] = useState("");
    const handleAdd = (input: string) => {
        const inputLabel = trimFull(input);

        for (const label of labels) {
            if (label == inputLabel) {
                alert("already exist.");
                return;
            }
        }
        if (options?.onAdd && !options.onAdd?.(inputLabel)) {
            const msg = options?.validationMsgOnAdd || "validation error onAdd.";
            alert(msg);
            return;
        }

        onChange([input, ...labels]);
        setInput("")
    }

    const handleDelete = (deletedLabel: string) => {
        if (options?.onDelete && !options.onDelete?.(deletedLabel)) {
            const msg = options?.validationMsgOnDelete || "validation error onDelete.";
            alert(msg);
            return;
        }

        onChange(labels.filter(label => label != deletedLabel));
    }

    return (
        <div>
            <div style={{ display: "flex" }}>
                <button onClick={() => handleAdd(input)}>追加</button>
                <AutoSuggestInput
                    input={input}
                    onChange={setInput}
                    suggestions={options?.inputSuggestions || []}
                    placeholder={options?.inputPlaceholder || ""}
                    onEnter={(noteName: string) => handleAdd(noteName)}
                    onSelect={(noteName: string) => handleAdd(noteName)}
                />
            </div>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {labels.map(label =>
                    <Fragment key={label}>
                        <li style={{ display: "flex", gap: "0.5em", alignItems: "center" }}>
                            <button onClick={() => handleDelete(label)}>削除</button>
                            <span>- {label}</span>
                        </li>
                    </Fragment>
                )}
            </ul>
        </div>
    )
}