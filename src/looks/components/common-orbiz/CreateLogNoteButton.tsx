
import { StdNote } from "src/core/domain/StdNote";
import { OUM } from "src/orbiz/managers/OrbizUseCaseManager";

export function CreateLogNoteButton({
    rootNote,
    label = "create log"
}: {
    rootNote?: StdNote,
    label?: string,
}) {
    const handleOpenFmEdit = () => {
        OUM().prompt.createLogNote({ rootNote: rootNote });
    }
    return (
        <button
            // style={{ backgroundColor: "skyblue" }}
            onClick={handleOpenFmEdit}
        >
            {label}
        </button>
    )
}