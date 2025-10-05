import { TFile } from "obsidian";
import { ReactNode } from "react";
import { FmAttrContextEditor } from "src/looks/components/note-metadata-edit/log/FmAttrContextEditor";
import { FmAttrStatusEditor } from "src/looks/components/note-metadata-edit/log/FmAttrStatusEditor";
import { FmAttrAspectEditor } from "src/looks/components/note-metadata-edit/my/FmAttrAspectEditor";
import { FmAttrRoleKindEditor } from "src/looks/components/note-metadata-edit/my/FmAttrRoleKindEditor";
import { FmAttrIdDisplay } from "src/looks/components/note-metadata-view/base/FmAttrIdDisplay";
import { FmAttrTypeDisplay } from "src/looks/components/note-metadata-view/base/FmAttrTypeDisplay";
import { FmAttrContextDisplay } from "src/looks/components/note-metadata-view/log/FmAttrContextDisplay";
import { FmAttrStatusDisplay } from "src/looks/components/note-metadata-view/log/FmAttrStatusDisplay";
import { FmAttrAspectDisplay } from "src/looks/components/note-metadata-view/my/FmAttrAspectDisplay";
import { FmAttrRoleKindDisplay } from "src/looks/components/note-metadata-view/my/FmAttrRoleKindDisplay";
import { FmAttrSubTypeDisplay } from "src/looks/components/note-metadata-view/std/FmAttrSubTypeDisplay";
import { FmKey } from "src/orbits/contracts/fmKey";
import { MyNoteAspect } from "src/orbits/schema/frontmatters/Aspect";
import { DiaryNoteType, LogNoteType, MyNoteType, NoteType } from "src/orbits/schema/frontmatters/NoteType";
import { LogNoteStatus } from "src/orbits/schema/frontmatters/Status";
import { LogNoteState, MyNoteState } from "src/orbits/schema/NoteState";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { OSM } from "src/orbiz/managers/OrbizSettingManager";
import { StoreApi } from "zustand";
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

    // getEditBox(): ReactNode {
    //     return <FmStringEditBox
    //         fmEditor={this}
    //     />
    // }
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

    setStore(store: StoreApi<any>): void {
        OEM.throwUnexpectedError();
    }
    getView(): ReactNode {
        return (<>
            <FmAttrIdDisplay
                fmAttr={this}
            />
        </>)
    }
    getEditableView(): ReactNode {
        return <></>
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
    setStore(store: StoreApi<any>): void {
        OEM.throwUnexpectedError();
    }
    getView(): ReactNode {
        return (<>
            <FmAttrTypeDisplay
                fmAttr={this}
            />
        </>)
    }
    getEditableView(): ReactNode {
        return <></>
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
    setStore(store: StoreApi<any>): void {
        OEM.throwUnexpectedError();
    }
    getView(): ReactNode {
        return (<>
            <FmAttrSubTypeDisplay
                fmAttr={this}
            />
        </>)
    }
    getEditableView(): ReactNode {
        return <></>
    }
}

export class FmAttrRoleKind extends FmAttrString {
    protected _store: StoreApi<MyNoteState> | null;
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

    setStore(store: StoreApi<MyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrRoleKind;
        this._storeSetter = (value: string) => state.setFmAttrRoleKind(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
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

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrRoleKindDisplay
                store={this._store}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrRoleKindEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }

    // getEditBox(): ReactNode {
    //     return <FmAttrSelectBox
    //         fmEditor={this}
    //         options={OSM().roleKinds}
    //     />
    // }
}

export class FmAttrAspect extends FmAttrString<MyNoteAspect> {
    protected _store: StoreApi<MyNoteState> | null;
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

    setStore(store: StoreApi<MyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrAspect;
        this._storeSetter = (value: MyNoteAspect) => state.setFmAttrAspect(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrAspectDisplay
                store={this._store}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrAspectEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }

    // getEditBox(): ReactNode {
    //     const options = myNoteAspectList.map(a => {
    //         return {
    //             label: a,
    //             value: a,
    //         }
    //     })
    //     return <FmAttrSelectBox
    //         fmEditor={this}
    //         options={options}
    //     />
    // }
}

export class FmAttrStatus extends FmAttrString<LogNoteStatus> {
    protected _store: StoreApi<LogNoteState> | null;
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

    setStore(store: StoreApi<LogNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrStatus;
        this._storeSetter = (value: LogNoteStatus) => state.setFmAttrStatus(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrStatusDisplay
                store={this._store}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrStatusEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }

    // getEditBox(): ReactNode {
    //     const options = logNoteStatusList.map(a => {
    //         return {
    //             label: a,
    //             value: a,
    //         }
    //     })
    //     return <FmAttrSelectBox
    //         fmEditor={this}
    //         options={options}
    //     />
    // }
}

export class FmAttrContext extends FmAttrString {
    protected _store: StoreApi<LogNoteState> | null;
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

    setStore(store: StoreApi<LogNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrStatus;
        this._storeSetter = (value: LogNoteStatus) => state.setFmAttrContext(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }

    getView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrContextDisplay
                store={this._store}
            />
        </>)
    }
    getEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrContextEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }
}