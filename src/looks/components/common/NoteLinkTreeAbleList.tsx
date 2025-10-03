import { Note } from "src/orbits/contracts/note-orb";
import { RecursiveTree } from "src/orbits/contracts/tree";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { NoteLinkTreeAble } from "./NoteLinkTreeAble";

export function NoteLinkTreeAbleList({
    noteTrees,
    rootNotePath = OAM().rootPath,
    isDefaultTree = false,
    cutSlug
}: {
    noteTrees: RecursiveTree<Note>[],
    rootNotePath?: string,
    isDefaultTree?: boolean,
    cutSlug?: string
}) {
    if (noteTrees.length === 0) {
        return null;
    }

    return (<>
        <ul
            style={{
                marginTop: 0,
                marginBottom: 0
            }}
        >
            {noteTrees.map(noteTree => (
                <li key={noteTree.hub.path}>
                    <NoteLinkTreeAble
                        noteTree={noteTree}
                        rootNotePath={rootNotePath}
                        isDefaultTree={isDefaultTree}
                        cutSlug={cutSlug}
                    />
                </li>
            ))}
        </ul>
    </>);
}