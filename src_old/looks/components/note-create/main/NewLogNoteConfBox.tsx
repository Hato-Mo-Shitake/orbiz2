import { ReactNode, useState } from "react";
import { StdNote } from "src/core/domain/StdNote";
import { isNewLogNoteConf, NewLogNoteConf, NewStdNoteConf } from "src/orbits/contracts/create-note";
import { isLogNoteType, logNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";
import { isLogNoteStatus, logNoteStatusList } from "src/orbits/schema/frontmatters/Status";
import { DateTimePicker } from "../../common/DateTimePicker";
import { SelectBox } from "../../common/SelectBox";
import { NewStdNoteConfBox } from "../sub/NewStdNoteConfBox";

export function NewLogNoteConfBox({
    resolve,
    options
}: {
    resolve: (conf: NewLogNoteConf) => void,
    options?: {
        baseName?: string,
        rootNote?: StdNote,
    }
}): ReactNode {
    const handleClick = () => {
        const newConf: Partial<NewLogNoteConf> = {};
        const baseName = newStdNoteConf.baseName;
        if (!baseName) {
            alert("input baseName");
            return;
        }
        newConf.baseName = baseName;

        const subType = newStdNoteConf.subType;
        if (!isLogNoteType(subType)) {
            alert("subType is invalid.");
            return;
        }
        newConf.subType = subType;
        newConf.linkedConf = newStdNoteConf.linkedConf;

        if (_hasStatus && isLogNoteStatus(status)) {
            newConf.status = status;
        }
        if (_hasDue && due) {
            newConf.due = due;
        }
        if (_hasContext && context) {
            newConf.context = context;
        }

        if (!isNewLogNoteConf(newConf)) {
            alert("input data is not enough!");
            return;
        }

        resolve(newConf);
    };

    const rootSubType = options?.rootNote?.fmCache["subType"];
    const [newStdNoteConf, setNewStdNoteConf] = useState<Partial<NewStdNoteConf>>({
        baseName: options?.baseName,
        subType: isLogNoteType(rootSubType) ? rootSubType : "todo",
    });

    const [_hasStatus, _setHasStatus] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");

    const [_hasDue, _setHasDue] = useState<boolean>(false);
    const [due, setDue] = useState<Date | null>(null);

    const [_hasContext, _setHasContext] = useState<boolean>(false);
    const [context, setContext] = useState<string>("");

    return (<>
        <h1>to create LogNote</h1>

        <button
            onClick={handleClick}
            style={{
                margin: "15px 0 15px 0"
            }}
        >
            create!
        </button>

        <NewStdNoteConfBox
            newStdNoteConf={newStdNoteConf}
            onChange={setNewStdNoteConf}
            subTypeList={[...logNoteTypeList]}
            options={{
                rootNote: options?.rootNote
            }}
        />

        <div>
            <h4>
                <label style={{ display: "flex", gap: "0.5em" }} >
                    has status
                    <input
                        type="checkbox"
                        checked={_hasStatus}
                        onChange={(evt) => _setHasStatus(evt.target.checked)}
                        style={{
                            position: "relative",
                            top: "5px"
                        }}
                    />
                </label>
            </h4>
        </div>
        <div>{_hasStatus &&
            <SelectBox
                value={status}
                onChange={setStatus}
                options={[...logNoteStatusList]}
            />
        }</div>

        <div>
            <h4>
                <label style={{ display: "flex", gap: "0.5em" }} >
                    has due
                    <input
                        type="checkbox"
                        checked={_hasDue}
                        onChange={(evt) => _setHasDue(evt.target.checked)}
                        style={{
                            position: "relative",
                            top: "5px"
                        }}
                    />
                </label>
            </h4>
        </div>
        <div>{_hasDue &&
            <DateTimePicker
                value={due}
                onChange={setDue}
            />
        }</div>

        <div>
            <h4>
                <label style={{ display: "flex", gap: "0.5em" }} >
                    has context
                    <input
                        type="checkbox"
                        checked={_hasContext}
                        onChange={(evt) => _setHasContext(evt.target.checked)}
                        style={{
                            position: "relative",
                            top: "5px"
                        }}
                    />
                </label>
            </h4>
        </div>
        <div>{_hasContext &&
            <input
                value={context}
                onChange={(evt) => setContext(evt.target.value)}
                style={{ width: "80%", padding: "8px", boxSizing: "border-box" }}
            />
        }</div>
    </>);
}