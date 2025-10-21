import { Notice } from "obsidian";
import { useState } from "react";
import { FmAttr } from "src/core/orb-system/services/fm-attrs/FmAttr";

export function useFmAttrForcedEditable<T>(fmAttr: FmAttr<T>): {
    newValue: T | null,
    handleUpdate: (value: T) => Promise<void>
} {
    const [newValue, setNewValue] = useState<T | null>(null);

    const handleUpdate = async (value: T) => {
        try {
            await fmAttr.forcedUpdate(value);
            setNewValue(value);
            new Notice(`${fmAttr.fmKey} has been forcedly updated.`);
        } catch (e) {
            alert("commit failed. check console");
            console.error(e);
        }
    }

    return { newValue, handleUpdate };
}