import { Fragment } from "react/jsx-runtime";
import { Note } from "src/orbits/contracts/note-orb";
import { RecursiveTree } from "src/orbits/contracts/tree";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { NoteLinkTree } from "./NoteLinkTree";

export function NoteLinkTreeList({
    noteTrees,
    rootNotePath = OAM().rootPath,
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
        {noteTrees.map(noteTree => (
            <Fragment key={noteTree.hub.id}>
                <NoteLinkTree
                    noteTree={noteTree}
                    rootNotePath={rootNotePath}
                    cutSlug={cutSlug}
                />
            </Fragment>
        ))}
    </>)
}