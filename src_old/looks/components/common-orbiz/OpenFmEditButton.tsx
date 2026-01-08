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
            onClick={handleOpenFmEdit}
        >
            edit fm
        </button>
    )
}