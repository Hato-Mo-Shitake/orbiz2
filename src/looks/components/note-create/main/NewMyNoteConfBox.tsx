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

        // TODO: 追々整理してください。
        // const baseName = roleNodeConf.kind || newStdNoteConf.baseName;
        // if (!baseName) {
        //     alert("input baseName");
        //     return;
        // }

        newConf.baseName = newStdNoteConf.baseName;

        const subType = newStdNoteConf.subType;
        if (!isMyNoteType(subType)) {
            alert("subType is invalid.");
            return;
        }
        newConf.subType = subType;

        newConf.linkedConf = newStdNoteConf.linkedConf;

        // if (_hasRole && isRoleNodeConf(roleNodeConf)) {
        //     if (roleNodeConf.hub.baseName.includes("@")) {
        //         alert("RoleHubノートにRoleNodeノートは指定できません。");
        //         return;
        //     }
        //     newConf.roleNodeConf = roleNodeConf;
        // }

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

    const [newStdNoteConf, setNewStdNoteConf] = useState<Partial<NewStdNoteConf>>({
        baseName: options?.baseName,
        subType: "knowledge",
    });

    // const [_hasRole, _setHasRole] = useState<boolean>(false);
    // const [roleNodeConf, setRoleNodeConf] = useState<Partial<RoleNodeConf>>({
    //     kind: undefined,
    //     hub: options?.rootNote,
    // });

    const [_hasAspect, _setHasAspect] = useState<boolean>(false);
    const [aspect, setAspect] = useState<string>("default");

    const [_hasCategories, _setHasCategories] = useState<boolean>(false);
    const [categories, setCategories] = useState<string[]>([]);

    // let defaultRoleHub: MyNote | undefined = undefined;
    // if (options?.rootNote && isMyNote(options.rootNote)) {
    //     defaultRoleHub = options.rootNote;
    // }
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

        {/* <div>
            <h4>
                <label style={{ display: "flex", gap: "0.5em" }} >
                    has role
                    <input
                        type="checkbox"
                        checked={_hasRole}
                        onChange={(evt) => _setHasRole(evt.target.checked)}
                        style={{
                            position: "relative",
                            top: "5px"
                        }}
                    />
                </label>
            </h4>
        </div>
        <div>{_hasRole &&
            <>
                <RoleNodeConfBox
                    roleNodeConf={roleNodeConf}
                    onChange={setRoleNodeConf}
                    options={{
                        hubNote: defaultRoleHub
                    }}
                />
                <br />
                <div style={{ color: "red" }}>※ ノート名は自動的に「RoleKind@RoleHubのノート名」になります。</div>
                <div style={{ color: "red" }}>※ subTypeは自動的に「RoleHub」と同じになります。</div>
            </>
        }</div> */}

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