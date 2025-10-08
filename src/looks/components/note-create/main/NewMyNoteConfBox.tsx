import { ReactNode, useState } from "react";
import { StdNote } from "src/core/domain/StdNote";
import { isNewMyNoteConf, NewMyNoteConf, NewStdNoteConf } from "src/orbits/contracts/create-note";
import { isMyNoteAspect, myNoteAspectList } from "src/orbits/schema/frontmatters/Aspect";
import { isMyNoteType, myNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";
import { OSM } from "src/orbiz/managers/OrbizSettingManager";
import { SelectableItemList } from "../../common/SelectableItemList";
import { SelectBox } from "../../common/SelectBox";
import { NewStdNoteConfBox } from "../sub/NewStdNoteConfBox";

export function NewMyNoteConfBox({
    resolve,
    options
}: {
    resolve: (conf: NewMyNoteConf) => void,
    options?: {
        baseName?: string,
        rootNote?: StdNote,
    }
}): ReactNode {
    const handleClick = () => {
        const newConf: Partial<NewMyNoteConf> = {};

        newConf.baseName = newStdNoteConf.baseName;

        const subType = newStdNoteConf.subType;
        if (!isMyNoteType(subType)) {
            alert("subType is invalid.");
            return;
        }
        newConf.subType = subType;

        newConf.linkedConf = newStdNoteConf.linkedConf;

        if (_hasAspect && isMyNoteAspect(aspect)) {
            newConf.aspect = aspect;
        }
        if (_hasCategories && categories.length) {
            newConf.categories = categories;
        }

        if (!isNewMyNoteConf(newConf)) {
            alert("input data is invalid!");
            return;
        }
        resolve(newConf);
    };

    const rootSubType = options?.rootNote?.fmCache["subType"];
    const [newStdNoteConf, setNewStdNoteConf] = useState<Partial<NewStdNoteConf>>({
        baseName: options?.baseName,
        subType: isMyNoteType(rootSubType) ? rootSubType : "knowledge",
    });

    const [_hasAspect, _setHasAspect] = useState<boolean>(false);
    const [aspect, setAspect] = useState<string>("default");

    const [_hasCategories, _setHasCategories] = useState<boolean>(false);
    const [categories, setCategories] = useState<string[]>([]);

    return (<>
        <h1>to create MyNote</h1>

        <button
            onClick={handleClick}
            style={{
                margin: "15px 0 15px 0"
            }}
        >
            create!
        </button>

        <NewStdNoteConfBox
            newStdNoteConf={newStdNoteConf}
            onChange={setNewStdNoteConf}
            subTypeList={[...myNoteTypeList]}
            options={{
                rootNote: options?.rootNote
            }}
        />

        <div>
            <h4>
                <label style={{ display: "flex", gap: "0.5em" }} >
                    has aspect
                    <input
                        type="checkbox"
                        checked={_hasAspect}
                        onChange={(evt) => _setHasAspect(evt.target.checked)}
                        style={{
                            position: "relative",
                            top: "5px"
                        }}
                    />
                </label>
            </h4>
        </div>
        <div>{_hasAspect &&
            <SelectBox
                value={aspect}
                onChange={setAspect}
                options={[...myNoteAspectList]}
            />
        }</div>

        <div>
            <h4>
                <label style={{ display: "flex", gap: "0.5em" }} >
                    has categories
                    <input
                        type="checkbox"
                        checked={_hasCategories}
                        onChange={(evt) => _setHasCategories(evt.target.checked)}
                        style={{
                            position: "relative",
                            top: "5px"
                        }}
                    />
                </label>
            </h4>
        </div>
        <div>{_hasCategories &&
            <SelectableItemList
                selectedList={categories}
                onChange={setCategories}
                selections={OSM().categories}
            />
        }</div>
    </>);
}