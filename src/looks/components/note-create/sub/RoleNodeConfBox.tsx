import { useEffect } from "react";
import { MyNote } from "src/core/domain/MyNote";
import { RoleNodeConf } from "src/orbits/contracts/create-note";
import { OSM } from "src/orbiz/managers/OrbizSettingManager";
import { SelectBox } from "../../common/SelectBox";

export function RoleNodeConfBox({
    roleNodeConf,
    onChange,
    roleHub
}: {
    roleNodeConf: Partial<RoleNodeConf>,
    onChange: (conf: Partial<RoleNodeConf>) => void,
    roleHub: MyNote
}) {

    const handleRoleKind = (kind: string) => {
        const newConf: Partial<RoleNodeConf> = { ...roleNodeConf };
        newConf.kind = kind;
        onChange(newConf);
    }

    // TODO: この辺りはもっと整理すべきだと思うけど、一旦。。。。
    useEffect(() => {
        const conf: Partial<RoleNodeConf> = {};
        conf.hub = roleHub;
        conf.kind = OSM().roleKinds[0];
        onChange(conf);
    }, [])

    return (<>
        <h6 style={{ marginBottom: "3px" }}>note name: role-kind@role-hub</h6>
        <div className="orbiz__item--flex-small">
            <SelectBox
                value={OSM().roleKinds[0]}
                onChange={handleRoleKind}
                options={OSM().roleKinds}
            />
            @
            <span>
                {roleHub.baseName}
            </span>
        </div>

    </>)
}