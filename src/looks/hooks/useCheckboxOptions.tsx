import { useState } from "react";
import { ReactSetState } from "src/orbits/contracts/react";
import { CheckboxOption } from "../components/common/CheckBoxes";

export function useCheckboxOptions<T>(
    values: T[],
    optionObj?: {
        genLabel?: (value: T) => string,
        defaultValues?: T[]
    }): {
        checkedList: T[],
        setCheckedList: ReactSetState<T[]>
        options: CheckboxOption<T>[]
    } {
    const options: CheckboxOption<T>[] = values.map(val => {
        const label = optionObj?.genLabel?.(val) || val;
        return {
            label: String(label),
            value: val
        };
    });
    const defaultValues = optionObj?.defaultValues || values
    const [checkedList, setCheckedList] = useState<T[]>([...defaultValues]);

    return {
        checkedList,
        setCheckedList,
        options,
    }
}