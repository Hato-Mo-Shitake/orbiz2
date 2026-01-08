import { Fragment } from "react/jsx-runtime";
import { AM } from "src/app/AppManager";
import { Note } from "src/orbits/contracts/note-orb";
import { RecursiveTree } from "src/orbits/contracts/tree";
import { NoteLinkTree } from "./NoteLinkTree";

export function NoteLinkTreeList({
    noteTrees,
    rootNotePath = AM.orbiz.rootPath,
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