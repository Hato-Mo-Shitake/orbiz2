import { ReactNode } from "react";
import { AM } from "src/app/AppManager";
import { getBasenameFromPath } from "src/assistance/utils/path";

export function NoteLink({
    linkText,
    beginningPath = AM.orbiz.rootPath,
    children
}: {
    linkText: string,
    beginningPath?: string,
    children?: ReactNode | string
}) {
    const ws = AM.obsidian.workspace;
    const handleNoteLinkClick = (evt: React.MouseEvent, linkText: string) => {
        if (evt.metaKey) {
            // コマンドキーを押しながらの時
            ws.openLinkText(linkText, beginningPath, "tab");
        } else if (evt.shiftKey) {
            ws.openLinkText(linkText, beginningPath, "window");
        } else {
            ws.openLinkText(linkText, beginningPath);
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