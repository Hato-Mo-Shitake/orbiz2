import { TFile } from "obsidian";
import { ReactNode } from "react";
import { FmAttrSelectBox } from "src/looks/components/fm-edit/sub/FmAttrSelectBox";
import { FmStringEditBox } from "src/looks/components/fm-edit/sub/FmStringEditBox";
import { FmKey } from "src/orbits/contracts/fmKey";
import { MyNoteAspect, myNoteAspectList } from "src/orbits/schema/frontmatters/Aspect";
import { DiaryNoteType, LogNoteType, MyNoteType, NoteType } from "src/orbits/schema/frontmatters/NoteType";
import { LogNoteStatus, logNoteStatusList } from "src/orbits/schema/frontmatters/Status";
import { OSM } from "src/orbiz/managers/OrbizSettingManager";
import { FmAttrSimpleValue } from "./FmAttrSimpleValue";

export abstract class FmAttrString<TValue extends string = string> extends FmAttrSimpleValue<TValue> {
    constructor(
        tFile: TFile,
        fmKey: FmKey<"string">,
        _value: TValue,
        options?: {
            isImmutable?: boolean,
        }
    ) {
        super(
            tFile,
            fmKey,
            _value,
            {
                isImmutable: options?.isImmutable
            }
        );
    }

    getEditBox(): ReactNode {
        return <FmStringEditBox
            fmEditor={this}
        />
    }
}

export class FmAttrId extends FmAttrString {
    constructor(
        tFile: TFile,
        _value: string,
    ) {
        super(
            tFile,
            "id",
            _value,
            {
                isImmutable: true,
            }
        )
    }
}

export class FmAttrType<TType extends NoteType = NoteType> extends FmAttrString {
    constructor(
        tFile: TFile,
        _value: TType,
    ) {
        super(
            tFile,
            "type",
            _value,
            {
                isImmutable: true,

            }
        )
    }
}

export class FmAttrSubType<TSubType extends MyNoteType | LogNoteType | DiaryNoteType = MyNoteType | LogNoteType | DiaryNoteType> extends FmAttrString<TSubType> {
    constructor(
        tFile: TFile,
        _value: TSubType,
    ) {
        super(
            tFile,
            "subType",
            _value,
            {
                isImmutable: true,
            }
        )
    }
}

export class FmAttrRoleKind extends FmAttrString {
    constructor(
        tFile: TFile,
        _value: string | null | undefined,
    ) {
        super(
            tFile,
            "roleKind",
            _value || "",
        )
    }

    filter(value: string): string {
        if (!OSM().roleKinds.includes(value)) {
            return "";
        }
        return value;
    }

    validate(value: string): boolean {
        return OSM().roleKinds.includes(value) || value == "";
    }

    getEditBox(): ReactNode {
        return <FmAttrSelectBox
            fmEditor={this}
            options={OSM().roleKinds}
        />
    }
}

export class FmAttrAspect extends FmAttrString<MyNoteAspect> {
    constructor(
        tFile: TFile,
        _value: MyNoteAspect | null | undefined,
    ) {
        super(
            tFile,
            "aspect",
            _value || "default",
        )
    }

    getEditBox(): ReactNode {
        const options = myNoteAspectList.map(a => {
            return {
                label: a,
                value: a,
            }
        })
        return <FmAttrSelectBox
            fmEditor={this}
            options={options}
        />
    }
}

export class FmAttrStatus extends FmAttrString<LogNoteStatus> {
    constructor(
        tFile: TFile,
        _value: LogNoteStatus | null | undefined,
    ) {
        super(
            tFile,
            "status",
            _value || "default",
        )
    }

    getEditBox(): ReactNode {
        const options = logNoteStatusList.map(a => {
            return {
                label: a,
                value: a,
            }
        })
        return <FmAttrSelectBox
            fmEditor={this}
            options={options}
        />
    }
}

export class FmAttrContext extends FmAttrString {
    constructor(
        tFile: TFile,
        _value: string | null | undefined,
    ) {
        super(
            tFile,
            "context",
            _value || "",
        )
    }
}