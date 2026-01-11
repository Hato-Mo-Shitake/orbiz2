
import { FmDisplayModal } from "src/looks/modals/FmDisplayModal";
import { NoteViewer } from "src/orbits/contracts/note-orb";

export function OpenFmDisplayButton({
    viewer
}: {
    viewer: NoteViewer
}) {
    const handleOpenFmEdit = () => {
        FmDisplayModal.openNew(viewer);
    }
    return (
        <button
            onClick={handleOpenFmEdit}
        >
            fm display
        </button>
    )
}