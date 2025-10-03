import { getBasenameFromPath } from "src/assistance/utils/path";
import { Note } from "src/orbits/contracts/note-orb";
import { RecursiveTree } from "src/orbits/contracts/tree";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { NoteLink } from "./NoteLink";

export function NoteLinkTree({
    noteTree,
    rootNotePath = OAM().rootPath,
    cutSlug
}: {
    noteTree: RecursiveTree<Note>,
    rootNotePath?: string,
    cutSlug?: string
}) {
    const createTree = (noteTrees: RecursiveTree<Note>[]) => {
        return (
            <ul
                style={{
                    marginTop: 0,
                    marginBottom: 0
                }}
            >
                {noteTrees.map((noteTree) => (
                    <li key={noteTree.hub.id}>
                        <NoteLink
                            linkText={noteTree.hub.path}
                            beginningPath={rootNotePath}
                        >
                            {cutSlug
                                ? getBasenameFromPath(noteTree.hub.path).replace(cutSlug, "")
                                : getBasenameFromPath(noteTree.hub.path)
                            }
                        </NoteLink>
                        {noteTree.nodes && createTree(noteTree.nodes)}
                    </li>
                ))}
            </ul>
        )
    }

    return createTree([noteTree]);
}