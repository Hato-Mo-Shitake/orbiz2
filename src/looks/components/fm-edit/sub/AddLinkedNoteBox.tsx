import { StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb"
import { LinkedNoteDirection, linkedNoteDirectionList } from "src/orbits/contracts/create-note"
import { FmKey } from "src/orbits/contracts/fmKey"
import { fmKeysForStdLinkedNoteList } from "src/orbits/schema/frontmatters/FmKey"

export function AddLinkedNoteBox({
    linkedNoteOrb,
    onAdd,
    labels
}: {
    linkedNoteOrb: StdNoteOrb,
    onAdd: (addNoteOrb: StdNoteOrb, key: FmKey<"stdLinkedNoteList">, direction: LinkedNoteDirection) => void,
    labels: Record<FmKey<"stdLinkedNoteList">, Record<LinkedNoteDirection, string>>
}) {
    return (<>
        <h6>{linkedNoteOrb.note.baseName}</h6>
        <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
            <span style={{ fontSize: "20px" }}>add to</span>
            {fmKeysForStdLinkedNoteList.map(key =>
                <div
                    key={`${linkedNoteOrb.note.id}-${key}`}
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    {[...linkedNoteDirectionList].reverse().map(d =>
                        <button
                            onClick={() => onAdd(linkedNoteOrb, key, d)}
                            key={`${linkedNoteOrb.note.id}-${key}-${d}`}
                        >
                            <span>{labels[key][d]}</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    </>)
}