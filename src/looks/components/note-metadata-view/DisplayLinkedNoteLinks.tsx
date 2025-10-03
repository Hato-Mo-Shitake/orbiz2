import { getBasenameFromPath } from "src/assistance/utils/path";
import { RecursiveTree } from "src/orbits/contracts/tree";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { NoteLink } from "../common/NoteLink";

export function LinkedNoteLinks({
    ids,
    rootNotePath,
    cutSlug
}: {
    ids: string[],
    rootNotePath: string,
    cutSlug?: string
}) {
    if (ids.length === 0) {
        return null;
    }

    return (<>
        <ul
            style={{
                marginTop: 0,
                marginBottom: 0
            }}
        >
            {ids.map(id => (
                <li key={id}>
                    <LinkedNoteLink
                        targetId={id}
                        rootNotePath={rootNotePath}
                        cutSlug={cutSlug}
                    />
                </li>
            ))}
        </ul>
    </>);
}

export function LinkedNoteLinkTree({
    idTrees,
    rootNotePath,
}: {
    idTrees: RecursiveTree<string>[],
    rootNotePath: string,
}) {
    if (idTrees.length === 0) {
        return null;
    }

    const createList = (idTrees: RecursiveTree<string>[]) => {
        return (
            <ul
                style={{
                    marginTop: 0,
                    marginBottom: 0
                }}
            >
                {idTrees.map((idTree) => (
                    <li key={idTree.hub}>
                        <LinkedNoteLink
                            targetId={idTree.hub}
                            rootNotePath={rootNotePath}
                        />
                        {idTree.nodes && createList(idTree.nodes)}
                    </li>
                ))}
            </ul>
        )
    }

    return createList(idTrees);
}

function LinkedNoteLink({
    targetId,
    rootNotePath,
    cutSlug,
}: {
    targetId: string
    rootNotePath: string,
    cutSlug?: string,
}) {
    const source = OCM().getStdNoteSourceById(targetId)!;
    const label = getBasenameFromPath(source.path);
    return (
        <NoteLink
            linkText={source.path}
            beginningPath={rootNotePath}
        >
            {cutSlug ? label.replace(cutSlug, "") : label}
        </NoteLink>
    )
}