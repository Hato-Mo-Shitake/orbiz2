import { ReactSetState } from "src/orbits/contracts/react";

export type CheckboxOption<T> = { label: string, value: T };
type CheckBoxesProps<T> = {
    options: CheckboxOption<T>[];
    checkedList: T[];                  // 選択済みの値配列（controlled）
    setCheckedList: ReactSetState<T[]>; // 選択が変わったら新しい配列を返す
    name?: string;                        // input の name（同グループで固有に）
    gap?: string | number;                // 横の隙間（例: "8px" or 8）
    className?: string;
};

export function CheckBoxes<T>({
    options,
    checkedList,
    setCheckedList,
    name = "checkboxes",
    gap = 1,
    className,
}: CheckBoxesProps<T>) {
    const handleChange = (value: T, checked: boolean) => {
        if (checked) {
            // チェックを入れた → 配列に追加
            setCheckedList([...checkedList, value]);
        } else {
            // チェックを外した → 配列から削除
            setCheckedList(checkedList => checkedList.filter((v) => v !== value));
        }
    };

    return (
        <div
            className={className}
            style={{
                display: "flex",
                gap: typeof gap === "number" ? `${gap}em` : gap,
                alignItems: "center",
                flexWrap: "wrap",
            }}
        >
            {options.map((opt) => {
                const id = `${name}-${opt.label}`;
                const checked = checkedList.includes(opt.value);
                return (
                    <label key={opt.label} htmlFor={id} style={{ display: "inline-flex", alignItems: "center", gap: "0.05em" }}>
                        <input
                            id={id}
                            type="checkbox"
                            name={name}
                            value={opt.label}
                            checked={checked}
                            onChange={(evt) => handleChange(opt.value, evt.target.checked)}
                        />
                        <span>{opt.label}</span>
                    </label>
                );
            })}
        </div>
    );
};