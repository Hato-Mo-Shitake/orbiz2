
export function generateCurrentIsoDatetime(): string {
    const now = new Date();
    const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    return jst.toISOString().slice(0, 19);
}

export function getCurrentYearMonth(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0始まりなので+1
    return `${year}-${month}`;
}



// ローカル地域基準
// console.log(formatDate(ts, "Y-m-d_D_H:i")); // "2025-09-19_Fri_13:04"
type DateFormatType = "Y-m-d" | "Y-m" | "Y" | "m" | "d" | "D" | "Y-m-d_D" | "Y-m-d_H:i" | "Y-m-d_H:i_D";
export function dateFormat(timeSource: number | Date, format: DateFormatType): string {
    let date: Date;
    if (typeof timeSource === "number") {
        date = new Date(timeSource); // タイムスタンプ
    } else {
        date = timeSource;
    }

    const pad = (n: number) => String(n).padStart(2, "0");

    const map: Record<string, string> = {
        Y: String(date.getFullYear()),                 // 年 (4桁)
        m: pad(date.getMonth() + 1),                   // 月 (01-12)
        d: pad(date.getDate()),                        // 日 (01-31)
        H: pad(date.getHours()),                       // 時 (00-23)
        i: pad(date.getMinutes()),                     // 分 (00-59)
        s: pad(date.getSeconds()),                     // 秒 (00-59)
        D: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()], // 曜日(短縮)
    };

    return format.replace(/Y|m|d|H|i|s|D/g, (token) => map[token]);
}