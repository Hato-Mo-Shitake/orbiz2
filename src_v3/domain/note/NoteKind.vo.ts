import { ValueObject } from "src_v3/domain/common/ValueObject.vo";
import { ValueObjectError } from "../common/domain-error";
import { VALUE_OBJECT_ERROR_MSG } from "../common/domain-error.rules";

const _myNoteKindList = [
    "KNOWLEDGE",
    "WIP",
    "CREATORIUM",
    "GALLERY",
    "FAQ",
] as const;
const _logNoteKindList = [
    "TODO",
    "SCHEDULE",
    "MEMO",
    "NOTICE",
    "PLAN",
] as const;
const _stdNoteKindList = [
    ..._myNoteKindList,
    ..._logNoteKindList,
] as const;
const _diaryNoteKindList = [
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "YEARLY",
] as const;

const _allNoteKindList = [
    ..._stdNoteKindList,
    ..._diaryNoteKindList
] as const;

type MyNoteKindCode = typeof _myNoteKindList[number];
type NoteKindCode = typeof _allNoteKindList[number];

const _brand = "NoteKind";

function _validate(value: string): asserts value is NoteKindCode {
    if (!(_allNoteKindList as ReadonlyArray<string>).includes(value)) {
        throw new ValueObjectError(VALUE_OBJECT_ERROR_MSG.invalidValue, _brand, value);
    }
}

/**
 * NoteKindの値オブジェクト
 */
export class NoteKind extends ValueObject<NoteKindCode> {
    /**
     * コンストラクタ
     * 
     * @param value
     */
    private constructor(value: NoteKindCode) {
        _validate(value);
        super(value, _brand);
    }

    static get(kind: NoteKindCode): NoteKind {
        return new NoteKind(kind);
    }

    static getMy(kind: MyNoteKindCode): NoteKind {
        return this.get(kind);
    }

    // 他のkindも

    public isMy(): boolean {
        return (_myNoteKindList as ReadonlyArray<string>).includes(this._value);
    }

    // 他のkindも
}