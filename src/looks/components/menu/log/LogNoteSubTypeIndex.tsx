import { TFile } from "obsidian";
import { useState } from "react";
import { LogNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { LogNoteStatus, logNoteStatusList } from "src/orbits/schema/frontmatters/Status";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { OTM } from "src/orbiz/managers/OrbizTFileManager";
import { ScrollableBox } from "../../common/ScrollableBox";
import { NoteList } from "../../searchlights/sub/NoteList";
import { MainNav } from "../navigate/MainNav";
import { LogNoteIndex } from "./LogNoteIndex";

export function LogNoteSubTypeIndex({
    subType,
    closeModal
}: {
    subType: LogNoteType,
    closeModal?: () => void;
}) {
    const [currentStatus, setCurrentStatus] = useState<LogNoteStatus | null>(null);

    const filter = (t: TFile): boolean => {
        if (currentStatus === null) return true;

        const fmCache = OAM().app.metadataCache.getFileCache(t)?.frontmatter;
        if (!fmCache) return false;

        if (currentStatus === "default") {
            if (!fmCache["status"] || fmCache["status"] == "default") return true;
        } else {
            if (fmCache["status"] == currentStatus) return true;
        }
        return false;
    }

    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <hr />
        <LogNoteIndex isHorizon={true} closeModal={closeModal} />
        <h1>{subType} index</h1>

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
                tFileList={OTM().getAllLogTFilesForSubType(subType)}
                beginningPath={OAM().rootPath}
                cutSlug={`〈-${subType}-〉`}
                closeModal={closeModal}
                filter={filter}
            />
        </ScrollableBox>
    </>)
}