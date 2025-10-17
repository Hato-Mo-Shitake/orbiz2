import { TFile } from "obsidian";
import { useEffect, useState } from "react";
import { AM } from "src/app/AppManager";
import { getBasenameFromPath } from "src/assistance/utils/path";

export function NoteList({
    tFileList,
    beginningPath = AM.orbiz.rootPath,
    chunk = 50,
    cutSlug,
    closeModal,
    filter
}: {
    tFileList: TFile[],
    beginningPath?: string,
    chunk?: number,
    cutSlug?: string,
    closeModal?: () => void,
    filter?: (tFile: TFile) => void
}) {
    const filteredSorted = (tFiles: TFile[]): TFile[] => {
        return filter
            ? tFiles.filter(filter).sort((a, b) => (b.stat.mtime - a.stat.mtime))
            : tFiles.sort((a, b) => (b.stat.mtime - a.stat.mtime))
    }
    useEffect(() => {
        setSorted(filteredSorted(tFileList));
        setSliced(filteredSorted(tFileList).slice(0, chunk));
    }, [filter])

    const [sorted, setSorted] = useState<TFile[]>(filteredSorted(tFileList));
    const [sliced, setSliced] = useState<TFile[]>(
        sorted.slice(0, chunk)
    )
    const isPagination = sorted.length > chunk ? true : false;


    // const sourcePath = beginningPath || AM.orbiz.rootPath;

    const ws = AM.obsidian.app.workspace;

    const handleNoteLinkClick = (evt: React.MouseEvent, linkText: string) => {
        closeModal?.()
        if (evt.metaKey) {
            // コマンドキーを押しながらの時
            ws.openLinkText(linkText, beginningPath, "tab");
        } else if (evt.shiftKey) {
            ws.openLinkText(linkText, beginningPath, "window");
        } else {
            ws.openLinkText(linkText, beginningPath);
        }
    }

    const pageBetweens: [number, number, number][] = [];
    for (let i = 0; i < Math.floor(tFileList.length / chunk) + 1; i++) {
        const pageNum = i + 1;
        const start = 0 + (i * chunk);
        const end = pageNum * chunk;
        pageBetweens.push([pageNum, start, end]);
    }

    const handleChangePage = (sliceStart: number, sliceEnd: number) => {
        setSliced(sorted.slice(sliceStart, sliceEnd))
    }
    return (
        <>
            <>{isPagination &&
                <div style={{ display: "flex", gap: "0.2em", alignItems: "center" }}>
                    {pageBetweens.map(between => {
                        return (
                            <button
                                key={between[0]}
                                onClick={() => { handleChangePage(between[1], between[2]) }}
                            >
                                {between[0]}
                            </button>
                        )
                    })}
                </div>
            }
            </>
            <ul>
                {sliced.map(t =>
                    <li key={t.path}>
                        <a
                            onClick={(evt) => handleNoteLinkClick(evt, t.path)}
                        >
                            {cutSlug
                                ? getBasenameFromPath(t.path).replace(cutSlug, "")
                                : getBasenameFromPath(t.path)
                            }
                        </a>
                    </li>
                )}
            </ul>
        </>
    )
}