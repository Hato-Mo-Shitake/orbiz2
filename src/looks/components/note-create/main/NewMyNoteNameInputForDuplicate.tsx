import { useState } from "react"
import { StdNote } from "src/core/domain/StdNote"
import { IndividualNames } from "src/looks/modals/prompt/PromptMyNoteNameForDuplicateModal"
import { NewMyNoteConf } from "src/orbits/contracts/create-note"
import { isMyFm } from "src/orbits/schema/frontmatters/fm"
import { OEM } from "src/orbiz/managers/OrbizErrorManager"

export function NewMyNoteNameInputForDuplicate({
    resolve,
    newNoteConf,
    alreadyNote
}: {
    resolve: (names: IndividualNames) => void,
    newNoteConf: NewMyNoteConf,
    alreadyNote: StdNote
}) {
    const dupName = newNoteConf.baseName;

    // 一旦roleHubと他のroleNode全部の名前書き換えるのは考えないことにしよう。
    // if (dupName.includes("@")) {
    //     OEM.throwNotImplementedError();
    // }

    const defaultNewNoteName = `${dupName}〈-${newNoteConf.subType}-〉`;
    const fm = alreadyNote.fmCache;
    if (!isMyFm(fm)) OEM.throwUnexpectedError();
    const defaultAlreadyNoteName = `${dupName}〈-${fm.subType}-〉`;

    const [newName, setNewName] = useState(defaultNewNoteName);
    const [alreadyName, setAlreadyName] = useState(defaultAlreadyNoteName);

    const handleResolve = () => {
        resolve({
            newNoteName: newName,
            alreadyNoteName: alreadyName
        });
    }
    return (<>
        <h1>resolve duplicate</h1>
        <button onClick={handleResolve}>commit</button>
        <h2>new note name input</h2>
        <input
            value={newName}
            onChange={(evt) => { setNewName(evt.target.value) }}
        />

        <h2>already note name input</h2>
        <input
            value={alreadyName}
            onChange={(evt) => { setAlreadyName(evt.target.value) }}
        />
    </>)
}