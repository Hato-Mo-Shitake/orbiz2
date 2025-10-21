import { TFile } from "obsidian";
import { useCallback, useState } from "react";
import { AM } from "src/app/AppManager";
import { MyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { ScrollableBox } from "../../common/ScrollableBox";
import { SelectBox } from "../../common/SelectBox";
import { MyNoteMenu } from "../../menu/my/MyNoteMenu";
import { MainNav } from "../../menu/navigate/MainNav";
import { NoteList } from "../../searchlights/sub/NoteList";


export function MyNoteIndex({
    subType,
    closeModal
}: {
    subType?: MyNoteType,
    closeModal?: () => void;
}) {
    const [category, setCategory] = useState("all");

    const filter = useCallback((t: TFile): boolean => {
        const fmCache = AM.obsidian.metadataCache.getFileCache(t)?.frontmatter;
        if (!fmCache) return false;

        if (category === "all") return true;

        const categories = fmCache["categories"];
        if (Array.isArray(categories) && categories.includes(category)) return true;

        return false;
    }, [category]);

    return (<>
        <MainNav
            closeModal={closeModal}
        />
        <hr />
        <MyNoteMenu isHorizon={true} closeModal={closeModal} />
        <h1>{subType || "my note"} index</h1>
        <div className="orbiz__item--flex-small">
            <div>category filter： </div>
            <SelectBox
                value={category}
                onChange={setCategory}
                options={["all", ...AM.orbizSetting.categories]}
            />
        </div>
        <ScrollableBox
            height={"500px"}
        >
            <NoteList
                tFileList={subType ? AM.tFile.getAllMyTFilesForSubType(subType) : AM.tFile.allMyTFiles}
                beginningPath={AM.orbiz.rootPath}
                cutSlug={`〈-${subType}-〉`}
                closeModal={closeModal}
                filter={filter}
            />
        </ScrollableBox>
    </>)
}