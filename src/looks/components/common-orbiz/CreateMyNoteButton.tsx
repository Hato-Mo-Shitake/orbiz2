
import { StdNote } from "src/core/domain/StdNote";
import { OUM } from "src/orbiz/managers/OrbizUseCaseManager";

export function CreateMyNoteButton({
    rootNote,
    label = "create my"
}: {
    rootNote?: StdNote,
    label?: string,
}) {
    const handleOpenFmEdit = () => {
        OUM().prompt.createMyNote({ rootNote: rootNote });
    }
    return (
        <button
            style={{ backgroundColor: "skyblue" }}
            onClick={handleOpenFmEdit}
        >
            {label}
        </button>
    )
}