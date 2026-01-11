
import { AM } from "src/app/AppManager";
import { MyNote } from "src/core/domain/MyNote";

export function CreateRoleNodeButton({
    rootNote,
    label = "create role node"
}: {
    rootNote: MyNote,
    label?: string,
}) {
    const handleOpenFmEdit = () => {
        AM.useCase.prompt.createRoleNode(rootNote);
    }
    return (
        <button
            onClick={handleOpenFmEdit}
        >
            {label}
        </button>
    )
}