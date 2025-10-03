import { Notice } from "obsidian";
import { useEffect, useState } from "react";
import { FmAttr } from "src/core/orb-system/services/fm-attrs/FmAttr";
import { ReactSetState } from "src/orbits/contracts/react";

export function useFmAttrEditable<T>(fmAttr: FmAttr<T>): {
    newValue: T | null,
    setNewValue: ReactSetState<T>,
    handleCommit: () => Promise<void>
} {
    const value = structuredClone(fmAttr.value);
    const [newValue, setNewValue] = useState<T | null>(null);

    useEffect(() => {
        // わかった.Viewが切り替わった先で、同じコンポーネントがあると、一番最初に評価した初期値を元にしちゃうんだ。
        // 引数だけ入れ替えているイメージ。だからここが必要。
        // 下記のuseEffectでやっているのはfmAttr内のnewValueにセットしているだけだから、循環が発生することはない。
        setNewValue(value);
        // 同root内で同じ構成のノートを切り替える際に、
        // 引数で受け取るfmAttrが変わってもnewValueの初期値には反映されない（一番最初の一回が参照される）ので
        // これが必要。
    }, [fmAttr]);

    useEffect(() => {
        if (newValue === null) return;
        fmAttr.setNewValue(newValue);
    }, [newValue]);

    const handleCommit = async () => {
        try {
            await fmAttr.commitNewValue();
            new Notice(`${fmAttr.fmKey} has been updated.`);
        } catch (e) {
            alert("commit failed. check console");
            console.error(e);
        }
    }

    return { newValue, setNewValue, handleCommit };
}