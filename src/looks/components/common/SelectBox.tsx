import { isStringArray } from "src/assistance/utils/validation";

type Option = {
    label?: string;
    value: string;
};

export function SelectBox({
    value,
    onChange,
    options,
}: {
    value: string,
    onChange: (value: string) => void,
    options: Option[] | string[]
}) {
    const selections = isStringArray(options)
        ? options.map(opt => {
            return { value: opt, label: opt }
        })
        : options;
    return (
        <select
            defaultValue={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {selections.map(opt => (
                <option key={opt.value} value={opt.value}
                // selected={opt.value == value}
                >
                    {opt.label || opt.value}
                </option>
            ))}
        </select>
    );
}