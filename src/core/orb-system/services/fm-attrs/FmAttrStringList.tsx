import { TFile } from "obsidian";
import { ReactNode } from "react";
import { arraysEqual } from "src/assistance/utils/array";
import { FmAttrSelectableList } from "src/looks/components/fm-edit/sub/FmAttrSelectableList";
import { FmStringListEditBox } from "src/looks/components/fm-edit/sub/FmStringListEditBox";
import { CategorySearchlightModal } from "src/looks/modals/searchlights/CategorySearchlightModal";
import { TagSearchlightModal } from "src/looks/modals/searchlights/TagSearchlightModal";
import { FmAttrList } from "src/orbits/contracts/fmAttr";
import { FmKey } from "src/orbits/contracts/fmKey";
import { ORM } from "src/orbiz/managers/OrbizRepositoryManager";
import { OSM } from "src/orbiz/managers/OrbizSettingManager";
import { FmAttr } from "./FmAttr";

export abstract class FmAttrStringList<TAVal extends string = string> extends FmAttr<TAVal[]> implements FmAttrList<TAVal> {
    constructor(
        tFile: TFile,
        fmKey: FmKey,
        _value: TAVal[],
        options?: {
            isImmutable?: boolean,
        }
    ) {
        super(
            tFile,
            fmKey,
            options?.isImmutable || false,
            _value
        );
    }

    get value(): TAVal[] {
        return this._value || [];
    }

    addNewAVal(aVal: TAVal): this {
        if (this._newValue === undefined) {
            this._newValue = [...this.value];
        }

        this._newValue.push(aVal);
        return this;
    }
    // TODO: deleteNewAValあった方がいい？
    setNewValue(newValue: TAVal[]): this {
        if (this.isImmutable) throw new Error("can not update.");
        if (
            newValue === this._value
            || newValue === this._newValue
        ) return this;

        this._newValue = [...newValue];
        return this;
    }

    validateAVal(aVal: TAVal): boolean {
        return true;
    };
    validate(value: TAVal[]): boolean {
        for (const aVal of value) {
            if (!this.validateAVal(aVal)) return false;
        }
        return true;
    }

    filterAVal(aVal: TAVal): TAVal {
        return aVal;
    }
    filter(value: TAVal[]): TAVal[] {
        return value.map(this.filterAVal);
    }

    async commitNewValue(): Promise<void> {
        if (this.isImmutable) throw new Error("to update is not allowed.");
        if (!this._newValue) return;
        if (this.value === this._newValue) return;
        if (arraysEqual(this.value, this._newValue)) return;

        ORM().noteR.updateFmAttr(this.tFile, this.fmKey, this._newValue);
        this._value = this.newValue ? [...this.newValue] : [];
        this.afterCommit();
    }

    getEditBox(): ReactNode {
        return <FmStringListEditBox
            fmEditor={this}
        />
    }
}

export class FmAttrTags extends FmAttrStringList {
    constructor(
        tFile: TFile,
        _value: string[] | undefined | null,
    ) {
        super(
            tFile,
            "tags",
            _value || [],
        );
    }

    getLooks(): ReactNode {
        return (
            <div>
                <a onClick={() => {
                    TagSearchlightModal.open()
                }}>tags: </a>

                {String(this.value)}
            </div>
        );
    }
}

export class FmAttrAliases extends FmAttrStringList {
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
        options?: {
        }
    ) {
        super(
            tFile,
            "aliases",
            _value || [],
            {
            }
        );
    }
}

export class FmAttrCategories extends FmAttrStringList {
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "categories",
            _value || [],
        );
    }

    filterAVal(aVal: string): string {
        if (!OSM().categories.includes(aVal)) {
            return "";
        }
        return aVal;
    }

    validateAVal(aVal: string): boolean {
        return OSM().categories.includes(aVal) || aVal == "";
    }

    getLooks(): ReactNode {
        return (
            <div>
                <a onClick={() => {
                    CategorySearchlightModal.open()
                }}>categories: </a>

                {String(this.value)}
            </div>
        );
    }

    getEditBox(): ReactNode {
        return <FmAttrSelectableList
            fmEditor={this}
            selections={OSM().categories}
        />
    }
}

export class FmAttrTemplateDone extends FmAttrStringList {
    constructor(
        tFile: TFile,
        _value: string[] | null | undefined,
    ) {
        super(
            tFile,
            "templateDone",
            _value || [],
        );
    }
}
