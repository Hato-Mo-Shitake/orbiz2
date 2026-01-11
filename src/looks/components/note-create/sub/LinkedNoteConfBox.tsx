import { Fragment } from "react/jsx-runtime";
import { StdNote } from "src/core/domain/StdNote";
import { LinkedNoteConf, LinkedNoteDirection, linkedNoteDirectionList } from "src/orbits/contracts/create-note";
import { FmKey } from "src/orbits/contracts/fmKey";
import { fmKeysForStdLinkedNoteList } from "src/orbits/schema/frontmatters/FmKey";
import { StdNotePicker } from "../../common/StdNotePicker";

export function LinkedNoteConfBox({
    linkedConf,
    onChange,
    options
}: {
    linkedConf: Partial<LinkedNoteConf>,
    onChange: (conf: Partial<LinkedNoteConf>) => void,
    options?: {
        rootNote?: StdNote
    }
}) {
    const linkedLabels: Record<FmKey<"stdLinkedNoteList">, Record<LinkedNoteDirection, string>> = {
        "belongsTo": {
            "in": "parent",
            "out": "child"
        },
        "relatesTo": {
            "in": "relative elder",
            "out": "relative children"
        },
        "references": {
            "in": "reference",
            "out": "referenced"
        }
    }

    const handleRootNote = (note: StdNote | null) => {
        if (!note) return;
        const newConf: Partial<LinkedNoteConf> = { ...linkedConf };
        newConf.rootNote = note;

        onChange(newConf);
    }
    const handleLink = (direction: LinkedNoteDirection, key: FmKey<"stdLinkedNoteList">) => {

        const newConf: Partial<LinkedNoteConf> = { ...linkedConf };
        newConf.direction = direction;
        newConf.key = key;

        onChange(newConf);
    }

    return (<>
        <div style={{ margin: "15px 0 15px 0" }}>
            <label>
                root note

                <StdNotePicker
                    onChange={handleRootNote}
                    options={{
                        defaultNote: options?.rootNote
                    }}
                />
            </label>
        </div>

        <h6 style={{ marginBottom: "3px" }}>creating note role by root note</h6>
        {fmKeysForStdLinkedNoteList.map(key => (
            <Fragment key={key}>
                <ul style={{ margin: "2px 0 2px 0" }}>
                    {linkedNoteDirectionList.map(direction => (

                        <li key={`${key}-${direction}`} >
                            <label>
                                {linkedLabels[key][direction]}
                                <input
                                    type="radio"
                                    checked={direction === linkedConf.direction && key === linkedConf.key}
                                    onChange={() => {
                                        handleLink(direction, key);
                                    }}
                                />
                            </label>
                        </li>
                    ))}
                </ul>
            </Fragment>
        ))}
    </>)
}