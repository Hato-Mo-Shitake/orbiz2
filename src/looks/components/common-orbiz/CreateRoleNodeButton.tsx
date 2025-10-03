
import { MyNote } from "src/core/domain/MyNote";
import { OUM } from "src/orbiz/managers/OrbizUseCaseManager";

export function CreateRoleNodeButton({
    rootNote,
    label = "create role node"
}: {
    rootNote: MyNote,
    label?: string,
}) {
    const handleOpenFmEdit = () => {
        OUM().prompt.createRoleNode(rootNote);
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