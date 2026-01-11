import { Notice } from "obsidian";
import { useEffect, useState } from "react";
import { BaseNote } from "src/core/domain/Note";
import { FmAttr } from "src/core/orb-system/services/fm-attrs/FmAttr";
import { ReactSetState } from "src/orbits/contracts/react";

export function useFmAttrEditable<T>(fmAttr: FmAttr<T>): {
    newValue: T | null,
    setNewValue: ReactSetState<T>,
    handleCommit: () => Promise<void>
} {
    const [newValue, setNewValue] = useState<T | null>(null);

    useEffect(() => {
        // カスタムクラスのメソッド（ゲッター含む）はコピーされない（Dateなどは例外）ので、Noteを例外対応。
        // もっといい方法を考えたいが。。。。。
        // Noteに関しては参照コピーで問題なさそうだけど、さて。。。。
        let value: T | null;
        if (fmAttr.value instanceof BaseNote) {
            value = fmAttr.value;
        } else if (Array.isArray(fmAttr.value) && fmAttr.value[0] instanceof BaseNote) {
            value = fmAttr.value;
        } else {
            value = structuredClone(fmAttr.value);
        }

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