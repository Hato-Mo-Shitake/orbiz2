import { ValueObject } from "../../common/ValueObject.vo";
import { StdNoteId } from "./StdNoteId.vo";

const _brand = "StdNoteIdList";

function _validate(value: StdNoteId[]): void {
    const hasDuplicate = value.some((a, i) =>
        value.slice(i + 1).some(b => a.equals(b))
    );

    if (hasDuplicate) {
        throw new Error("Invalid StdNoteIdList value: must not duplicate.");
    }
}

export class StdNoteIdList extends ValueObject<StdNoteId[]> {
    private constructor(value: StdNoteId[]) {
        const list = [...value];
        _validate(list);
        super(list, _brand);
    }

    static from(value: StdNoteId[]): StdNoteIdList {
        return new StdNoteIdList(value);
    }

    isEmpty(): boolean {
        return this._value.length === 0;
    }

    isNotEmpty(): boolean {
        return !this.isEmpty();
    }

    has(id: StdNoteId): boolean {
        return this._value.some(val => id.equals(val));
    }

    add(id: StdNoteId): StdNoteIdList {
        if (this.has(id)) {
            return this;
        }
        return new StdNoteIdList([...this._value, id]);
    }

    remove(id: StdNoteId): StdNoteIdList {
        if (!this.has(id)) {
            return this;
        }
        return new StdNoteIdList(
            this._value.filter(val => !val.equals(id))
        );
    }

    contains(other: StdNoteIdList): boolean {
        return other._value.every(id => this.has(id));
    }

    equals(other: StdNoteIdList): boolean {
        return this.contains(other) && other.contains(this);
    }
}