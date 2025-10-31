import { TFile } from "obsidian";
import { useCallback, useState } from "react";
import { AM } from "src/app/AppManager";
import { LogNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { LogNoteStatus, logNoteStatusList } from "src/orbits/schema/frontmatters/Status";
import { ScrollableBox } from "../../common/ScrollableBox";
import { LogNoteMenu } from "../../menu/log/LogNoteMenu";
import { MainNav } from "../../menu/navigate/MainNav";
import { NoteList } from "../../searchlights/sub/NoteList";

export function LogNoteIndex({
    subType,
    closeModal
}: {
    subType?: LogNoteType,
    closeModal?: () => void;
}) {
    const [currentStatus, setCurrentStatus] = useState<LogNoteStatus | null>(null);
    const [excludeResolved, setExcludeResolved] = useState<boolean>(true);

    const filter = useCallback((t: TFile): boolean => {
        const fmCache = AM.obsidian.metadataCache.getFileCache(t)?.frontmatter;
        if (!fmCache) return false;

        if (excludeResolved && fmCache["resolved"]) return false;

        if (currentStatus === null) return true;

        if (currentStatus === "default") {
            if (!fmCache["status"] || fmCache["status"] == "default") return true;
        } else {
            if (fmCache["status"] == currentStatus) return true;
        }
        return false;
    }, [currentStatus, excludeResolved]);

    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <hr />
        <LogNoteMenu isHorizon={true} closeModal={closeModal} />
        <h1>{subType || "log note"} index</h1>

        <label className="orbiz__item--flex-small">
            <div>
                exclude resolved
            </div>
            <input
                type="checkbox"
                checked={excludeResolved}
                onChange={() => setExcludeResolved(!excludeResolved)}
            />
        </label>

        <div>
            filter
            <div className="orbiz__item--flex-small">
                <button onClick={() => setCurrentStatus(null)}>
                    <span className={!currentStatus ? "orbiz__text--underline-red" : ""} >
                        All
                    </span>
                </button>

                {logNoteStatusList.map(status =>
                    <button key={status} onClick={() => setCurrentStatus(status)}>
                        <span className={currentStatus == status ? "orbiz__text--underline-red" : ""} >
                            {status}
                        </span>
                    </button>
                )}
            </div>
        </div>

        <ScrollableBox
            height={"500px"}
        >
            <NoteList
                tFileList={subType ? AM.tFile.getAllLogTFilesForSubType(subType) : AM.tFile.allLogTFiles}
                cutSlug={`〈-${subType}-〉`}
                closeModal={closeModal}
                filter={filter}
                isDisplayNoteCount={true}
            />
        </ScrollableBox>
    </>)
}