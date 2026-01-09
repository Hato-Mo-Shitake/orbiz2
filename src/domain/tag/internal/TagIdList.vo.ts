import { ValueObject } from "../../common/ValueObject.vo";
import { TagId } from "./TagId.vo";

const _brand = "TagIdList";

function _validate(value: TagId[]): void {
    const hasDuplicate = value.some((a, i) =>
        value.slice(i + 1).some(b => a.equals(b))
    );

    if (hasDuplicate) {
        throw new Error("Invalid TagIdList value: must not duplicate.");
    }
}

export class TagIdList extends ValueObject<TagId[]> {
    private constructor(value: TagId[]) {
        const list = [...value];
        _validate(list);
        super(list, _brand);
    }

    static from(value: TagId[]): TagIdList {
        return new TagIdList(value);
    }

    isEmpty(): boolean {
        return this._value.length === 0;
    }

    has(id: TagId): boolean {
        return this._value.some(v => v.equals(id));
    }

    add(id: TagId): TagIdList {
        if (this.has(id)) {
            return this;
        }
        return new TagIdList([...this._value, id]);
    }

    remove(id: TagId): TagIdList {
        if (!this.has(id)) {
            return this;
        }
        return new TagIdList(this._value.filter(v => !v.equals(id)));
    }

    contains(other: TagIdList): boolean {
        return other._value.every(id => this.has(id));
    }

    equals(other: TagIdList): boolean {
        return this.contains(other) && other.contains(this);
    }
}