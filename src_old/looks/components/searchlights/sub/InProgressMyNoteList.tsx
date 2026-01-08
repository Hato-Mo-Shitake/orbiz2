import { TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { TFileFilter } from "src/assistance/helpers/TFileFilter";
import { dateFormat } from "src/assistance/utils/date";
import { getBasenameFromPath } from "src/assistance/utils/path";
import { DateDisplay } from "../../common/DateDisplay";

export function InProgressMyNoteList({
    closeModal,
    header = "",
    tFiles = AM.tFile.allMyTFiles
}: {
    closeModal?: () => void,
    header?: string,
    tFiles?: TFile[]
}) {
    const targetTFiles = TFileFilter.extractInProgressMyNote(tFiles);
    const ws = AM.obsidian.app.workspace;
    const handleNoteLinkClick = (evt: React.MouseEvent, linkText: string) => {
        closeModal?.()
        if (evt.metaKey) {
            // コマンドキーを押しながらの時
            ws.openLinkText(linkText, AM.orbiz.rootPath, "tab");
        } else if (evt.shiftKey) {
            ws.openLinkText(linkText, AM.orbiz.rootPath, "window");
        } else {
            ws.openLinkText(linkText, AM.orbiz.rootPath);
        }
    }
    if (!targetTFiles.length) return null;
    return (
        <>
            {<h5 style={{ marginLeft: "1rem" }}>{`${header ? `${header} | ` : ""} count: ${targetTFiles.length}`}</h5>}
            <ul style={{ marginTop: "0" }}>
                {targetTFiles.map(t => {
                    const fm = AM.obsidian.metadataCache.getFileCache(t)!.frontmatter!;
                    const start = fm["start"];
                    const targetDate = fm["targetDate"];
                    return <li key={t.path}>
                        <a
                            onClick={(evt) => handleNoteLinkClick(evt, t.path)}
                        >
                            {getBasenameFromPath(t.path).replace(/〈-[\s\S]*?-〉/g, "")}
                        </a>
                        <div>

                            {start && <span>
                                {"start: "}
                                <DateDisplay date={new Date(start)} />
                                {", "}
                            </span>}
                            targetDate: <span style={{ color: targetDate < AM.diary.todayMs ? "red" : "" }}>
                                {dateFormat(new Date(targetDate), "Y-m-d_D")}
                            </span>
                        </div>
                        <hr style={{ margin: "0.2rem 0 0.5rem 0" }} />
                    </li>
                }
                )}
            </ul>
        </>
    )
}