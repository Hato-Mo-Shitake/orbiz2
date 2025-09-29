import * as React from "react";
import { useState } from "react";
import { trimFull } from "src/assistance/utils/filter";
import { AutoSuggestInput } from "./AutoSuggestInput";

export function SubmitInputForm({
    onSubmit,
    btnName,
    suggestions,
    placeholder,
}: {
    onSubmit: (value: string) => void,
    btnName: string
    suggestions?: string[],
    placeholder?: string
}) {
    const [input, setInput] = useState("");

    function handleSubmit(evt: React.FormEvent) {
        evt.preventDefault();
        if (trimFull(input) === "") return;

        onSubmit(trimFull(input));
        setInput("");
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5em" }}>
            <button type="submit">{btnName}</button>
            <AutoSuggestInput
                input={input}
                setInput={setInput}
                suggestions={suggestions || []}
                placeholder={placeholder || ""}
            />
        </form>
    )
}