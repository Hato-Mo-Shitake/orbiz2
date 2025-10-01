import { TFile } from "obsidian";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export function NoteTopSection({ tFile }: { tFile: TFile }) {

    const fm = OAM().app.metadataCache.getFileCache(tFile)?.frontmatter;

    return (<>
        <div>file name: {tFile.path}</div>
        <ul>
            {fm && Object.entries(fm)?.map(([key, value]) =>
                <li>
                    {String(key)}: {String(value)}
                </li>
            )}
        </ul>
    </>);
}