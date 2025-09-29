import { Notice } from "obsidian";
import { useEffect, useState } from "react";
import { FmAttrEditor } from "src/orbits/contracts/fmAttr";
import { Listener } from "src/orbits/contracts/observer";

export function useFmAttrEditor<T>(editor: FmAttrEditor<T>, options?: { showNotice?: boolean }): {
    newValue: T | null,
    setNewValue: (newValue: T) => void,
    handleCommit: () => Promise<void>
} {
    const [newValue, setNewValue] = useState<T | null>(editor.value);

    useEffect(() => {
        const listener: Listener<T> = (newValue: T) => {
            setNewValue(newValue)
        };
        editor.addListener(listener);
        return () => editor.removeListener(listener);
    }, [editor]);

    useEffect(() => {
        if (newValue === null) return;
        if (editor.value != newValue && editor.newValue != newValue) {
            editor.setNewValue(newValue);
        }
    }, [newValue]);

    const handleCommit = async () => {
        try {
            await editor.commitNewValue();
            if (options?.showNotice === undefined || options?.showNotice === true) {
                new Notice(`${editor.fmKey} has been updated.`);
            }
        } catch (e) {
            alert("commit failed. check console");
            console.error(e);
        }
    }

    return { newValue, setNewValue, handleCommit };
}