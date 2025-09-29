import { useEffect } from "react";
import { isMyNote, MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { RoleNodeConf } from "src/orbits/contracts/create-note";
import { ONM } from "src/orbiz/managers/OrbizNoteManager";
import { OSM } from "src/orbiz/managers/OrbizSettingManager";
import { SelectBox } from "../../common/SelectBox";
import { StdNotePicker } from "../../common/StdNotePicker";

export function RoleNodeConfBox({
    roleNodeConf,
    onChange,
    options
}: {
    roleNodeConf: Partial<RoleNodeConf>,
    onChange: (conf: Partial<RoleNodeConf>) => void,
    options?: {
        hubNote?: MyNote
    }
}) {
    const handleRootNote = (note: StdNote | null) => {
        if (!note) return;
        if (!isMyNote) {
            alert("MyNoteを入力してください。");
            return;
        }
        const newConf: Partial<RoleNodeConf> = { ...roleNodeConf };
        newConf.hub = note;

        onChange(newConf);
    }

    const handleRoleKind = (kind: string) => {
        const newConf: Partial<RoleNodeConf> = { ...roleNodeConf };
        newConf.kind = kind;
        onChange(newConf);
    }

    // TODO: この辺りはもっと整理すべきだと思うけど、一旦。。。。
    useEffect(() => {
        roleNodeConf.hub = options?.hubNote;
        roleNodeConf.kind = OSM().roleKinds[0];
    }, [])

    return (<>
        <div style={{ margin: "15px 0 15px 0" }}>
            <label>
                role hub

                <StdNotePicker
                    onChange={handleRootNote}
                    options={{
                        defaultNote: options?.hubNote,
                        suggestions: ONM().allMyNoteNames
                    }}
                />
            </label>
        </div>

        <h6 style={{ marginBottom: "3px" }}>role kind</h6>
        <SelectBox
            value={OSM().roleKinds[0]}
            onChange={handleRoleKind}
            options={OSM().roleKinds}
        />
    </>)
}