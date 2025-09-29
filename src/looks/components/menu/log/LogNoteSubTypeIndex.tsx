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
    const _handleOpenModal = (modal: { open: () => void }): () => void => {
        return () => {
            closeModal?.();
            modal.open();
        }
    }

    const [filter, setFilter] = useState<(t: TFile) => boolean>(() => {
        return () => true;
    })
    const mc = OAM().app.metadataCache;

    const handleChangeFilter = (selectedStatus: LogNoteStatus | null) => {
        if (!selectedStatus) {
            setFilter(() => {
                return () => true;
            });
            return;
        }

        setFilter(() => {
            return (t: TFile): boolean => {
                const fmCache = mc.getFileCache(t)?.frontmatter;
                if (!fmCache) return false;

                if (selectedStatus === "default") {
                    if (!fmCache["status"] || fmCache["status"] == "default") return true;
                } else {
                    if (fmCache["status"] == selectedStatus) return true;
                }
                return false;
            }
        });
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
            <div style={{ display: "flex", gap: "0.2em" }}>
                <button onClick={() => handleChangeFilter(null)}>
                    All
                </button>
                {logNoteStatusList.map(status =>
                    <button key={status} onClick={() => handleChangeFilter(status)}>
                        {status}
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