import { useEffect } from "react";
import { AM } from "src/app/AppManager";
import { MyNote } from "src/core/domain/MyNote";
import { RoleNodeConf } from "src/orbits/contracts/create-note";
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
        // conf.kind = AM.orbizSetting.roleKinds[0];
        conf.kind = AM.orbizSetting.roleKinds[0];
        onChange(conf);
    }, [])

    return (<>
        <h6 style={{ marginBottom: "3px" }}>note name: role-kind@role-hub</h6>
        <div className="orbiz__item--flex-small">
            <SelectBox
                value={AM.orbizSetting.roleKinds[0]}
                onChange={handleRoleKind}
                options={AM.orbizSetting.roleKinds}
            />
            @
            <span>
                {roleHub.baseName}
            </span>
        </div>

    </>)
}