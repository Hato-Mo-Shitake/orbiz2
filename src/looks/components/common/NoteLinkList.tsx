import { AM } from "src/app/AppManager";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { Note } from "src/orbits/contracts/note-orb";
import { NoteLink } from "./NoteLink";

export function NoteLinkList({
    notes,
    // rootNotePath = OAM().rootPath,
    rootNotePath = AM.orbiz.rootPath,
    cutSlug
}: {
    notes: Note[],
    rootNotePath?: string,
    cutSlug?: string
}) {
    if (notes.length === 0) {
        return null;
    }

    return (<>
        <ul
            style={{ margin: "0", padding: "0" }}
        >
            {notes.map(n => (
                <li key={n.path}>
                    <NoteLink
                        linkText={n.path}
                        beginningPath={rootNotePath}
                    >
                        {cutSlug
                            ? getBasenameFromPath(n.path).replace(cutSlug, "")
                            : getBasenameFromPath(n.path)
                        }
                    </NoteLink>

                </li>
            ))}
        </ul>
    </>);
}