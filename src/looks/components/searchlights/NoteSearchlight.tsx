import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { generateCurrentIsoDatetime } from "src/assistance/utils/date";
import { useCheckboxOptions } from "src/looks/hooks/useCheckboxOptions";
import { MainMenuModal } from "src/looks/modals/menu/MainMenuModal";
import { DiaryNoteType, diaryNoteTypeList, LogNoteType, logNoteTypeList, MyNoteType, myNoteTypeList, NoteType, noteTypeList } from "src/orbits/schema/frontmatters/NoteType";
import { CheckBoxes } from "../common/CheckBoxes";
import { DateRange, DateRangePicker } from "../common/DateRangePicker";
import { Header } from "../common/Header";
import { ScrollableBox } from "../common/ScrollableBox";
import { MainNav } from "../menu/navigate/MainNav";

export function NoteSearchlight({
    closeModal
}: {
    closeModal: () => void;
}) {
    const now = generateCurrentIsoDatetime();
    const [dateRange, setDateRange] = useState<DateRange | null>(null)

    const noteTypeOptions = useCheckboxOptions<NoteType>([...noteTypeList], {
        genLabel: (value) => String(value).replace("Note", ""),
        defaultValues: ["myNote"]
    });
    const myNoteTypeOptions = useCheckboxOptions<MyNoteType>([...myNoteTypeList]);
    const logNoteTypeOptions = useCheckboxOptions<LogNoteType>([...logNoteTypeList]);
    const diaryNoteTypeOptions = useCheckboxOptions<DiaryNoteType>([...diaryNoteTypeList]);

    const typeOptionsList = [
        { title: "note types", hLevel: 2, options: noteTypeOptions, show: () => true },
        { title: "my-note types", hLevel: 4, options: myNoteTypeOptions, show: () => noteTypeOptions.checkedList.includes("myNote") },
        { title: "log-note types", hLevel: 4, options: logNoteTypeOptions, show: () => noteTypeOptions.checkedList.includes("logNote") },
        { title: "diary-note types", hLevel: 4, options: diaryNoteTypeOptions, show: () => noteTypeOptions.checkedList.includes("diaryNote") },
    ]

    const test = () => {
        typeOptionsList.forEach(opt => console.log(opt.options.checkedList));
        console.log(dateRange);
    }

    const handleOpenMainMenu = () => {
        closeModal();
        MainMenuModal.open();
    }

    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <h1>Note Searchlight</h1>
        <button onClick={test}>ボタン</button>
        <ScrollableBox height={"250px"}>
            {typeOptionsList.map(opt => {
                return (<Fragment key={opt.title}>
                    {opt.show() &&
                        <div>
                            <Header level={opt.hLevel}>{opt.title}</Header>
                            <CheckBoxes
                                options={opt.options.options}
                                checkedList={opt.options.checkedList}
                                setCheckedList={opt.options.setCheckedList}
                            />
                            <br />
                        </div>
                    }
                </Fragment>)
            })}
        </ScrollableBox>
        <div>
            <h2>date range</h2>
            <DateRangePicker setDateRange={setDateRange} />
            <br />
        </div>
    </>)
}