import { AM } from "src/app/AppManager";
import { dateFormat } from "src/assistance/utils/date";
import { NoteLink } from "./NoteLink";

export function DateDisplay({
    date,
    format = "Y-m-d_D"
}: {
    date: Date | null | undefined
    format?: "Y-m-d_D" | "Y-m-d_H:i_D"
}
) {
    if (!date) return <span></span>

    const dailyNotePath = AM.diary.getDailyNotePath(date)!;

    return (
        <span>
            <NoteLink linkText={dailyNotePath}>
                {dateFormat(date, format)}
            </NoteLink>
        </span>
    )
}