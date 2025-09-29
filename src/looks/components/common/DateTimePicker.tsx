type DateTimePickerProps = {
    value: Date | null;
    onChange: (date: Date | null) => void;
};

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange }) => {
    // Date → input 用文字列 (YYYY-MM-DDTHH:mm)
    const toInputValue = (date: Date | null): string => {
        if (!date) return "";
        const pad = (n: number) => String(n).padStart(2, "0");
        return (
            date.getFullYear() +
            "-" +
            pad(date.getMonth() + 1) +
            "-" +
            pad(date.getDate()) +
            "T" +
            pad(date.getHours()) +
            ":" +
            pad(date.getMinutes())
        );
    };

    // input の値 → Date に変換
    const fromInputValue = (val: string): Date | null => {
        if (!val) return null;
        return new Date(val);
    };

    return (
        <input
            type="datetime-local"
            value={toInputValue(value)}
            onChange={(e) => onChange(fromInputValue(e.target.value))}
        />
    );
};