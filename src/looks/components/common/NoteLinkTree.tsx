import { ReactNode, useEffect, useState } from "react";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { Note } from "src/orbits/contracts/note-orb";
import { RecursiveTree } from "src/orbits/contracts/tree";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { NoteLink } from "./NoteLink";

export function NoteLinkTree({
    noteTree,
    openTree = false,
    rootNotePath = OAM().rootPath,
    cutSlug,
    filter,
}: {
    noteTree: RecursiveTree<Note>,
    openTree?: boolean,
    rootNotePath?: string,
    cutSlug?: string,
    filter?: (note: Note) => boolean
}) {
    const createTree = (noteTrees: RecursiveTree<Note>[], isOpen: boolean) => {
        return (
            <ul
                style={{
                    marginTop: 0,
                    marginBottom: 0
                }}
            >
                {noteTrees.map((noteTree) => {
                    if (filter && !filter(noteTree.hub)) return null;

                    return (
                        <li key={noteTree.hub.id}>
                            <NoteLinkTreeAble
                                noteTree={noteTree}
                                createTree={createTree}
                                isOpen={isOpen}
                                rootNotePath={rootNotePath}
                                cutSlug={cutSlug}
                            />
                        </li>
                    )
                })}
            </ul>
        )
    }

    return createTree([noteTree], openTree);
}

function NoteLinkTreeAble({
    noteTree,
    isOpen = false,
    createTree,
    rootNotePath = OAM().rootPath,
    cutSlug
}: {
    noteTree: RecursiveTree<Note>,
    isOpen?: boolean,
    createTree: (noteTrees: RecursiveTree<Note>[], openTree: boolean) => ReactNode,
    rootNotePath?: string,
    cutSlug?: string
}) {
    const [openTree, setOpenTree] = useState(isOpen);

    useEffect(() => {
        setOpenTree(isOpen);
    }, [isOpen])

    const handleClick = (is: boolean) => {
        setOpenTree(is);
    }
    return (<>
        <div>
            {Boolean(noteTree.nodes.length) &&
                <>
                    {openTree
                        ? <span onClick={() => handleClick(false)}>▼</span>
                        : <span onClick={() => handleClick(true)}>▶︎</span>
                    }
                    <span>{" "}</span>
                </>
            }
            <NoteLink
                linkText={noteTree.hub.path}
                beginningPath={rootNotePath}
            >
                {cutSlug
                    ? getBasenameFromPath(noteTree.hub.path).replace(cutSlug, "")
                    : getBasenameFromPath(noteTree.hub.path)
                }
            </NoteLink>
            {Boolean(noteTree.nodes.length) && openTree && createTree(noteTree.nodes, openTree)}
        </div>
    </>)
}