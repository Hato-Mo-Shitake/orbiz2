import * as React from "react";
import { useState } from "react";
export function AutoSuggestInput({
    input,
    onChange,
    suggestions,
    placeholder = "",
    onSelect,
    onEnter
}: {
    input: string,
    onChange: (value: string) => void;
    suggestions: string[];
    placeholder?: string;
    onSelect?: (value: string) => void;
    onEnter?: (value: string) => void;
}) {
    const [filtered, setFiltered] = useState<string[]>([]);
    const [showList, setShowList] = useState(false);
    const [isComposing, setIsComposing] = useState(false);

    function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const value = evt.target.value;
        onChange(value);

        const matchList = suggestions.filter(item => {
            return item.toLowerCase().includes(value.toLowerCase());
        });
        setFiltered(matchList);
        setShowList(true);
    }

    function handleSelect(value: string) {
        onChange(value);
        setShowList(false);
        onSelect?.(value);
    }

    // function _handleSubmit(evt: React.FormEvent<HTMLInputElement>) {
    //     evt.preventDefault();
    //     onSubmit?.(input);
    // }

    const _handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === "Enter" && !isComposing) {
            onEnter?.(input);
        }
    }

    function handleBlur() {
        setTimeout(() => setShowList(false), 100);
    }

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <input
                type="text"
                placeholder={placeholder}
                value={input}
                onChange={handleChange}
                onBlur={handleBlur}
                // onSubmit={_handleSubmit}
                onKeyDown={_handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onFocus={() => input && setShowList(true)} // inputがtrueの時、setShowListを呼び出す。if文の略記的な。
                style={{ width: "80%", padding: "8px", boxSizing: "border-box" }}
            />
            {showList && filtered.length > 0 && (
                <ul
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        background: "#fff",
                        border: "1px solid #ccc",
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        zIndex: 10,
                        maxHeight: "200px",
                        overflowY: "auto"
                    }}
                >
                    {filtered.map(item => (
                        <li
                            key={item}
                            onMouseDown={() => handleSelect(item)}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee"
                            }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}