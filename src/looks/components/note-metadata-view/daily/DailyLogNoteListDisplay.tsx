import { StdNote } from "src/core/domain/StdNote";
import { DailyNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { FoldingElement } from "../../common/FoldingElement";
import { NoteLinkList } from "../../common/NoteLinkList";

export function DailyLogNoteListDisplay({
    store,
    selector,
    header = "",
}: {
    store: StoreApi<DailyNoteState>,
    selector: (state: DailyNoteState) => StdNote[],
    header?: string
}) {
    const notes = useStore(store, selector);
    if (!notes?.length) return null;

    return (<>
        {header
            ? <FoldingElement header={header} hLevel={0} defaultOpen={true}>
                <div style={{ marginLeft: "2rem" }}>
                    <NoteLinkList
                        notes={notes}
                    />
                </div>
            </FoldingElement>
            : <NoteLinkList
                notes={notes}
            />
        }
    </>)
}