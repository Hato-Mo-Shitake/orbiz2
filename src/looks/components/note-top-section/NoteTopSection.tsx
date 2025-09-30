import { TFile } from "obsidian";

export function NoteTopSection({ tFile }: { tFile: TFile }) {
    return (<>
        <div>file name: {tFile.path}</div>
    </>);
}