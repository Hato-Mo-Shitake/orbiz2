import { FmEditableModal } from "src/looks/modals/FmEditableModal";
import { NoteViewer } from "src/orbits/contracts/note-orb";

export function OpenFmEditButton({
    viewer
}: {
    viewer: NoteViewer
}) {
    const handleOpenFmEdit = () => {
        FmEditableModal.openNew(viewer);
    }
    return (
        <button
            style={{ backgroundColor: "skyblue" }}
            onClick={handleOpenFmEdit}
        >
            edit fm
        </button>
    )
}