import { ReactNode, useEffect, useState } from "react";
import { StdNote } from "src/core/domain/StdNote";
import { isLinkedNoteConf, LinkedNoteConf, NewStdNoteConf } from "src/orbits/contracts/create-note";
import { isSubNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { SelectBox } from "../../common/SelectBox";
import { LinkedNoteConfBox } from "../sub/LinkedNoteConfBox";

export function NewStdNoteConfBox({
    newStdNoteConf,
    onChange,
    subTypeList,
    options
}: {
    newStdNoteConf: Partial<NewStdNoteConf>,
    onChange: (conf: Partial<NewStdNoteConf>) => void,
    subTypeList: string[],
    options?: {
        rootNote?: StdNote,
    }
}): ReactNode {
    useEffect(() => {
        if (options?.rootNote?.id) {
            handleLink(linkedConf);
        }
    }, [])
    const [linkedConf, setLinkedConf] = useState<Partial<LinkedNoteConf>>({
        rootNote: options?.rootNote,
        direction: "out",
        key: "belongsTo",
    });

    const [_hasLinkedNote, _setHasLinkedNote] = useState<boolean>(true);

    const _handleHasLink = (checked: boolean) => {
        _setHasLinkedNote(checked);
        const newConf = { ...newStdNoteConf };
        if (checked) {
            if (!isLinkedNoteConf(linkedConf)) return;
            newConf.linkedConf = linkedConf;
            onChange(newConf);
        } else {
            newConf.linkedConf = undefined;
            onChange(newConf);
        }
    }

    const handleBaseName = (baseName: string) => {
        const newConf = { ...newStdNoteConf };
        newConf.baseName = baseName;
        onChange(newConf);
    }

    const handleSubType = (subType: string) => {
        if (!isSubNoteType(subType)) {
            alert("subType is invalid.");
            return;
        }
        const newConf = { ...newStdNoteConf };
        newConf.subType = subType;
        onChange(newConf);
    }

    const handleLink = (conf: Partial<LinkedNoteConf>) => {
        setLinkedConf(conf);

        if (!isLinkedNoteConf(conf)) return;
        const newConf = { ...newStdNoteConf };
        newConf.linkedConf = conf;

        onChange(newConf)
    }

    return (<>
        <div>
            <label>
                note base name
                <input
                    type="text"
                    value={newStdNoteConf.baseName || ""}
                    onChange={evt => handleBaseName(evt.target.value)}
                    style={{ width: "80%", padding: "8px", boxSizing: "border-box" }}
                />
            </label>
        </div>

        <div style={{ margin: "15px 0 15px 0" }}>
            <label>
                <div>
                    sub type
                </div>
                <SelectBox
                    value={newStdNoteConf.subType || ""}
                    onChange={handleSubType}
                    options={subTypeList.map(type => {
                        return { value: type };
                    })}
                />
            </label>
        </div>

        <div>
            <h4>
                <label style={{ display: "flex", gap: "0.5em" }} >
                    has link note
                    <input
                        type="checkbox"
                        checked={_hasLinkedNote}
                        onChange={(evt) => _handleHasLink(evt.target.checked)}
                        style={{
                            position: "relative",
                            top: "5px"
                        }}
                    />
                </label>
            </h4>
        </div>

        <div>{_hasLinkedNote &&
            <LinkedNoteConfBox
                linkedConf={linkedConf}
                onChange={handleLink}
                options={{
                    rootNote: options?.rootNote
                }}
            />
        }</div>
    </>);
}