import { ReactNode, useState } from "react";
import { MyNote } from "src/core/domain/MyNote";
import { isNewMyNoteConf, isRoleNodeConf, NewMyNoteConf, RoleNodeConf } from "src/orbits/contracts/create-note";
import { isMyNoteAspect, myNoteAspectList } from "src/orbits/schema/frontmatters/Aspect";
import { isMyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { SelectableItemList } from "../../common/SelectableItemList";
import { SelectBox } from "../../common/SelectBox";
import { RoleNodeConfBox } from "../sub/RoleNodeConfBox";

export function NewRoleNodeConfBox({
    resolve,
    roleHub
}: {
    resolve: (conf: NewMyNoteConf) => void,
    roleHub: MyNote
}): ReactNode {
    const handleClick = () => {
        const newConf: Partial<NewMyNoteConf> = {};

        if (!isRoleNodeConf(roleNodeConf)) {
            alert("invalid RoleNodeConf");
            return;
        }
        if (roleNodeConf.hub?.baseName.includes("@")) {
            alert("RoleHubノートにRoleNodeノートは指定できません。");
            return;
        }

        // Note: NoteCreatorで同じ値で上書きされる。
        const baseName = `${roleNodeConf.kind}@${roleNodeConf.hub.baseName}`
        const subType = roleHub.fmCache?.["subType"];
        if (!isMyNoteType(subType)) {
            alert("想定外のエラー.");
            return;
        }

        newConf.baseName = baseName;
        newConf.subType = subType;
        newConf.roleNodeConf = roleNodeConf;

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

    const [roleNodeConf, setRoleNodeConf] = useState<Partial<RoleNodeConf>>({
        kind: undefined,
        hub: roleHub
    });

    const [_hasAspect, _setHasAspect] = useState<boolean>(false);
    const [aspect, setAspect] = useState<string>("default");

    const [_hasCategories, _setHasCategories] = useState<boolean>(false);
    const [categories, setCategories] = useState<string[]>([]);

    return (<>
        <h1>to create RoleNode</h1>

        <button
            onClick={handleClick}
        >
            create!
        </button>

        <RoleNodeConfBox
            roleNodeConf={roleNodeConf}
            onChange={setRoleNodeConf}
            roleHub={roleHub}

        />
        <br />

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
                selections={AM.orbizSetting.categories}
            />
        }</div>
    </>);
}