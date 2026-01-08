
import { AM } from "src/app/AppManager";
import { StdNote } from "src/core/domain/StdNote";

export function CreateLogNoteButton({
    rootNote,
    label = "create log"
}: {
    rootNote?: StdNote,
    label?: string,
}) {
    const handleOpenFmEdit = () => {
        AM.useCase.prompt.createLogNote({ rootNote: rootNote });
    }
    return (
        <button
            onClick={handleOpenFmEdit}
        >
            {label}
        </button>
    )
}