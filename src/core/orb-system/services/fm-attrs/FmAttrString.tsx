import { TFile } from "obsidian";
import { ReactNode } from "react";
import { AM } from "src/app/AppManager";
import { getParentPath } from "src/assistance/utils/path";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { FmAttrContextEditor } from "src/looks/components/note-metadata-edit/log/FmAttrContextEditor";
import { FmAttrLogNoteTypeForcedEditor } from "src/looks/components/note-metadata-edit/log/FmAttrLogNoteTypeForcedEditor";
import { FmAttrStatusEditor } from "src/looks/components/note-metadata-edit/log/FmAttrStatusEditor";
import { FmAttrAspectEditor } from "src/looks/components/note-metadata-edit/my/FmAttrAspectEditor";
import { FmAttrMyNoteTypeForcedEditor } from "src/looks/components/note-metadata-edit/my/FmAttrMyNoteTypeForcedEditor";
import { FmAttrRoleKindEditor } from "src/looks/components/note-metadata-edit/my/FmAttrRoleKindEditor";
import { FmAttrIdDisplay } from "src/looks/components/note-metadata-view/base/FmAttrIdDisplay";
import { FmAttrTypeDisplay } from "src/looks/components/note-metadata-view/base/FmAttrTypeDisplay";
import { FmAttrDiaryNoteTypeDisplay } from "src/looks/components/note-metadata-view/diary/FmAttrDiaryNoteTypeDisplay";
import { FmAttrContextDisplay } from "src/looks/components/note-metadata-view/log/FmAttrContextDisplay";
import { FmAttrLogNoteTypeDisplay } from "src/looks/components/note-metadata-view/log/FmAttrLogNoteTypeDisplay";
import { FmAttrStatusDisplay } from "src/looks/components/note-metadata-view/log/FmAttrStatusDisplay";
import { FmAttrAspectDisplay } from "src/looks/components/note-metadata-view/my/FmAttrAspectDisplay";
import { FmAttrMyNoteTypeDisplay } from "src/looks/components/note-metadata-view/my/FmAttrMyNoteTypeDisplay";
import { FmAttrRoleKindDisplay } from "src/looks/components/note-metadata-view/my/FmAttrRoleKindDisplay";
import { FmKey } from "src/orbits/contracts/fmKey";
import { MyNoteAspect } from "src/orbits/schema/frontmatters/Aspect";
import { DiaryNoteType, isLogNoteType, isMyNoteType, LogNoteType, MyNoteType, NoteType } from "src/orbits/schema/frontmatters/NoteType";
import { LogNoteStatus } from "src/orbits/schema/frontmatters/Status";
import { DiaryNoteState, LogNoteState, MyNoteState } from "src/orbits/schema/NoteState";
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
        throw new UnexpectedError();
    }
    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        return (<>
            <FmAttrIdDisplay
                fmAttr={this}
                header={options?.header}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        throw new UnexpectedError();
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
        throw new UnexpectedError();
    }
    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        return (<>
            <FmAttrTypeDisplay
                fmAttr={this}
                header={options?.header}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        return <></>
    }
}

export class FmAttrMyNoteType extends FmAttrString<MyNoteType> {
    protected _store: StoreApi<MyNoteState> | null;
    constructor(
        tFile: TFile,
        _value: MyNoteType,
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
    get value(): MyNoteType {
        return this._value!;
    }
    setStore(store: StoreApi<MyNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrMyNoteType;
        this._storeSetter = (value: MyNoteType) => state.setFmAttrMyNoteType(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }
    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrMyNoteTypeDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        throw new UnexpectedError();
    }
    getForcedEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrMyNoteTypeForcedEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }
    protected afterCommit(): void {
        super.afterCommit();

        const preSubType = this.tFile.path.split("/")[2];

        if (!isMyNoteType(preSubType)) {
            console.error(preSubType);
            throw new UnexpectedError();
        }

        const path = this.tFile.path;
        const dirPath = getParentPath(path);

        const newDirPath = dirPath.replace(preSubType, this.value);

        AM.repository.noteR.changeTFileDir(this.tFile, newDirPath);
    }
}

export class FmAttrLogNoteType extends FmAttrString<LogNoteType> {
    protected _store: StoreApi<LogNoteState> | null;
    constructor(
        tFile: TFile,
        _value: LogNoteType,
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
    get value(): LogNoteType {
        return this._value!;
    }
    setStore(store: StoreApi<LogNoteState>): void {
        this._store = store;
        const state = store.getState();
        this._storeGetter = () => state.fmAttrLogNoteType;
        this._storeSetter = (value: LogNoteType) => state.setFmAttrLogNoteType(value);

        if (this._value) {
            this._storeSetter(this._value);
        }
    }
    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrLogNoteTypeDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        throw new UnexpectedError();
    }
    getForcedEditableView(): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrLogNoteTypeForcedEditor
                store={this._store}
                fmAttr={this}
            />
        </>)
    }

    protected afterCommit(): void {
        super.afterCommit();

        const preSubType = this.tFile.path.split("/")[2];

        if (!isLogNoteType(preSubType)) {
            throw new UnexpectedError();
        }

        const path = this.tFile.path;
        const dirPath = getParentPath(path);
        const newDirPath = dirPath.replace(preSubType, this.value);

        const newName = this.tFile.name.replace(`〈-${preSubType}-〉`, `〈-${this.value}-〉`);

        AM.repository.noteR.changeTFileDir(this.tFile, newDirPath, { newFileName: newName });
    }
}

export class FmAttrDiaryNoteType<TDiaryType extends DiaryNoteType = DiaryNoteType> extends FmAttrString<TDiaryType> {
    protected _store: StoreApi<DiaryNoteState> | null;
    constructor(
        tFile: TFile,
        _value: TDiaryType,
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
    setStore(store: StoreApi<DiaryNoteState>): void {
        throw new UnexpectedError();
        // this._store = store;
        // const state = store.getState();
        // this._storeGetter = () => state.fmAttrDiaryNoteType;
        // this._storeSetter = (value: DiaryNoteType) => state.setFmAttrDiaryNoteType(value);

        // if (this._value) {
        //     this._storeSetter(this._value);
        // }
    }
    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrDiaryNoteTypeDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
            />
        </>)
    }
    getEditableView(): ReactNode {
        throw new UnexpectedError();
        // if (!this._store) return null;
        // return (<>
        //     <FmAttrDiaryNoteEditor
        //         store={this._store}
        //         fmAttr={this}
        //     />
        // </>)
    }
}

// これ、MyNoteTypeとかで分けた方が良さそう
// forcedEditで強制変更できるようにして
// export class FmAttrSubType<TSubType extends MyNoteType | LogNoteType | DiaryNoteType = MyNoteType | LogNoteType | DiaryNoteType> extends FmAttrString<TSubType> {
//     protected _store: StoreApi<MyNoteState> | null;
//     constructor(
//         tFile: TFile,
//         _value: TSubType,
//     ) {
//         super(
//             tFile,
//             "subType",
//             _value,
//             {
//                 isImmutable: true,
//             }
//         )
//     }
//     setStore(store: StoreApi<any>): void {
//         this._store = store;
//         const state = store.getState();
//         this._storeGetter = () => state.;
//         this._storeSetter = (value: string) => state.setFmAttrRoleKind(value);

//         if (this._value) {
//             this._storeSetter(this._value);
//         }
//     }
//     getView(options?: { header?: string, headerWidth?: number }): ReactNode {
//         return (<>
//             <FmAttrSubTypeDisplay
//                 fmAttr={this}
//                 header={options?.header}
//                 headerWidth={options?.headerWidth}
//             />
//         </>)
//     }
//     getEditableView(): ReactNode {
//         if (!this._store) return null;
//         return (<>
//             <FmAttrMyNoteEditor
//                 store={this._store}
//                 fmAttr={this}
//             />
//         </>)
//     }
// }

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
            {
                isImmutable: true,
            }
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
        if (!AM.orbizSetting.roleKinds.includes(value)) {
            return "";
        }
        return value;
    }

    validate(value: string): boolean {
        return AM.orbizSetting.roleKinds.includes(value) || value == "";
    }

    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrRoleKindDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
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

    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrAspectDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
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

    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrStatusDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
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

    getView(options?: { header?: string, headerWidth?: number }): ReactNode {
        if (!this._store) return null;
        return (<>
            <FmAttrContextDisplay
                store={this._store}
                header={options?.header}
                headerWidth={options?.headerWidth}
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