import { Notice } from "obsidian";
import { ReactNode } from "react";
import { NoteEditor } from "src/orbits/contracts/note-orb";

export function FmEditBox({
    editor,
    children
}: {
    editor: NoteEditor,
    children: ReactNode
}) {
    // const [reloadKey, setReloadKey] = useState(0);

    const _handleCommit = async () => {
        await editor.commitNewFm();
        // setReloadKey(item => item + 1);
        try {
            await editor.commitNewFm();
            new Notice(`all fmKeys have been updated.`);
        } catch (e) {
            alert("commit failed. check console");
            console.error(e);
        }
    }

    return (
        // <ReloadWrapper key={reloadKey} >
        <div className="fm-edit-box">
            <h4 style={{ display: "flex", gap: "0.5em" }}>
                frontmatter edit
                <button onClick={_handleCommit}>全部更新</button>
            </h4>
            {children}
        </div>
        // </ReloadWrapper>
    )
}