type Option = {
    label?: string;
    value: string;
};

export type GroupedOption = {
    groupLabel: string;
    options: Option[];
};

type SelectBoxProps = {
    value: string;
    setValue: (value: string) => void;
    groupedOptions: GroupedOption[];
};

export function OptGroupedSelectBox({ value, setValue, groupedOptions }: SelectBoxProps) {
    return (
        <select value={value} onChange={(e) => setValue(e.target.value)}>
            {groupedOptions.map((group, index) => (
                <optgroup key={index} label={group.groupLabel}>
                    {group.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label || opt.value}
                        </option>
                    ))}
                </optgroup>
            ))}
        </select>
    );
}
