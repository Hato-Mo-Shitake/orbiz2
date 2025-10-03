import { useState } from "react";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { Note } from "src/orbits/contracts/note-orb";
import { RecursiveTree } from "src/orbits/contracts/tree";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { NoteLink } from "./NoteLink";
import { NoteLinkTree } from "./NoteLinkTree";

export function NoteLinkTreeAble({
    noteTree,
    rootNotePath = OAM().rootPath,
    isDefaultTree = false,
    cutSlug
}: {
    noteTree: RecursiveTree<Note>,
    rootNotePath?: string,
    isDefaultTree?: boolean,
    cutSlug?: string
}) {
    const [isTree, setIsTree] = useState(isDefaultTree);

    return (<>
        <label>
            tree
            <input
                type="checkbox"
                checked={isTree}
                onChange={(evt) => setIsTree(evt.target.checked)}
            />
        </label>

        {isTree ?
            <div>
                <NoteLinkTree
                    noteTree={noteTree}
                    rootNotePath={rootNotePath}
                    cutSlug={cutSlug}
                />
            </div>
            :
            <div>
                <NoteLink
                    linkText={noteTree.hub.path}
                    beginningPath={rootNotePath}
                >
                    {cutSlug
                        ? getBasenameFromPath(noteTree.hub.path).replace(cutSlug, "")
                        : getBasenameFromPath(noteTree.hub.path)
                    }
                </NoteLink>
            </div>
        }

    </>)
}