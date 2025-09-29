import { useState } from "react";
import { ReactSetState } from "src/orbits/contracts/react";

export type DateRange = {
    from: string;
    to: string;
};

export function DateRangePicker({
    setDateRange
}: {
    setDateRange: ReactSetState<DateRange | null>
}) {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFrom(value);
        setDateRange({ from: value, to });
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTo(value);
        setDateRange({ from, to: value });
    };

    return (<>
        <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
            <label>
                <div>
                    From:
                </div>
                <input type="date" value={from} onChange={handleFromChange} />
            </label>
            <span><br />〜</span>
            <label>
                <div>
                    To:
                </div>
                <input type="date" value={to} onChange={handleToChange} />
            </label>
            <button onClick={() => {
                setFrom("");
                setTo("");
                setDateRange(null)
            }}>クリア</button>
        </div>
    </>

    );
}