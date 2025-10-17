
import { isMyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { CreateRoleNodeButton } from "./CreateRoleNodeButton";

export function CreateMyNoteButton({
    rootNote,
    label = "create my"
}: {
    rootNote?: StdNote,
    label?: string,
}) {
    const handleOpenFmEdit = () => {
        AM.useCase.prompt.createMyNote({ rootNote: rootNote });
    }
    return (
        <span
        // className="orbiz__item--flex-small" 
        >
            <button onClick={handleOpenFmEdit}  >
                {label}
            </button>
            {(isMyNote(rootNote) && !rootNote.isRoleNode)
                && <span>
                    <span>(</span>
                    <CreateRoleNodeButton rootNote={rootNote} label="role-node" />
                    <span>)</span>
                </span>
            }
        </span>
    )
}