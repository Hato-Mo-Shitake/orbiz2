import { ReactNode } from "react";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export function NoteLink({
    linkText,
    beginningPath,
    children
}: {
    linkText: string,
    beginningPath?: string | null,
    children?: ReactNode | string
}) {
    const ws = OAM().app.workspace;
    const sourcePath = beginningPath || OAM().rootPath;
    const handleNoteLinkClick = (evt: React.MouseEvent, linkText: string) => {
        if (evt.metaKey) {
            // コマンドキーを押しながらの時
            ws.openLinkText(linkText, sourcePath, "tab");
        } else if (evt.shiftKey) {
            ws.openLinkText(linkText, sourcePath, "window");
        } else {
            ws.openLinkText(linkText, sourcePath);
        }
    }

    return (
        <>
            <a
                onClick={(evt) => handleNoteLinkClick(evt, linkText)}
            >
                {children || getBasenameFromPath(linkText)}
            </a>
        </>
    )
}