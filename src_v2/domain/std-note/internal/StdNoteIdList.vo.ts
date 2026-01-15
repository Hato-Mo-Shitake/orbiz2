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
        _validate(value);
        super(value, _brand);
    }

    static from(value: readonly StdNoteId[]): StdNoteIdList {
        const list = [...value];
        return new StdNoteIdList(list);
    }

    static fromRawIdList(rawIdList: readonly string[]): StdNoteIdList {
        const list = rawIdList.map(id => StdNoteId.from(id));
        return new StdNoteIdList(list);
    }

    get size(): number {
        return this._value.length;
    }

    isEmpty(): boolean {
        return this.size === 0;
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

    addList(other: StdNoteIdList): StdNoteIdList {
        if (other.isEmpty()) {
            return this;
        }

        const next = [...this._value];

        let changed = false;
        for (const id of other._value) {
            if (!next.some(v => v.equals(id))) {
                next.push(id);
                changed = true;
            }
        }

        return changed ? new StdNoteIdList(next) : this;
    }

    remove(id: StdNoteId): StdNoteIdList {
        if (!this.has(id)) {
            return this;
        }
        return new StdNoteIdList(
            this._value.filter(val => !val.equals(id))
        );
    }

    removeList(other: StdNoteIdList): StdNoteIdList {
        if (other.isEmpty() || this.isEmpty()) {
            return this;
        }

        const next = this._value.filter(
            id => !other.has(id)
        );

        if (next.length === this._value.length) {
            return this;
        }

        return new StdNoteIdList(next);
    }

    intersect(other: StdNoteIdList): StdNoteIdList {
        const next = this._value.filter(id => other.has(id));
        return next.length === this._value.length
            ? this
            : new StdNoteIdList(next);
    }

    contains(other: StdNoteIdList): boolean {
        return other._value.every(id => this.has(id));
    }

    equals(other: StdNoteIdList): boolean {
        return this.contains(other) && other.contains(this);
    }

    toArray(): readonly StdNoteId[] {
        return [...this._value];
    }
}