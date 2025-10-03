import { dateFormat } from "src/assistance/utils/date";
import { ODM } from "src/orbiz/managers/OrbizDiaryManager";
import { NoteLink } from "./NoteLink";

export function DateDisplay({
    date
}: {
    date: Date | null | undefined
}
) {
    if (!date) return <span></span>

    const dailyNotePath = ODM().getDailyNotePath(date)!;
    return (
        <span>
            <NoteLink linkText={dailyNotePath}>
                {dateFormat(date, "Y-m-d_H:i_D")}
            </NoteLink>
        </span>
    )
}