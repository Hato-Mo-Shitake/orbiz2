import { TagId, TagIdList } from "../../tag";

import { DateTimeTerm } from "../../common/DateTimeTerm.vo";

import { DateTime } from "../../common/DateTime.vo";
import { StdNoteId } from "./StdNoteId.vo";
import { StdNoteIdList } from "./StdNoteIdList.vo";
import { StdNoteKind } from "./StdNoteKind.vo";
import { StdNoteName } from "./StdNoteName.vo";
import { StdNotePath } from "./StdNotePath.vo";
import { StdNoteKindValue } from "./std-note.rules";

type StdNoteBaseProps = {
    path: StdNotePath;
    kind: StdNoteKind;
    tagIds: TagIdList;
    term: DateTimeTerm;
    belongsTo: StdNoteIdList;
    relatesTo: StdNoteIdList;
    references: StdNoteIdList;
};

type ReconstructProps = StdNoteBaseProps & {
    id: StdNoteId;
};

type CreateProps = StdNoteBaseProps;

export class StdNote {
    private constructor(
        private readonly _id: StdNoteId,
        private _path: StdNotePath,
        private readonly _kind: StdNoteKind,
        private _tagIds: TagIdList,
        private _term: DateTimeTerm,
        // outLinkNoteIdsは備えない。
        // → 代わりに、outlinkNoteIdsは必ず、belongsTo, relatesTo, referencesのいずれかに入れるルールを外部で設定して、
        // その制約の中で、belongsTo, relatesTo, references
        private _belongsTo: StdNoteIdList,
        private _relatesTo: StdNoteIdList,
        private _references: StdNoteIdList,
    ) {
    }

    static reconstruct(props: ReconstructProps): StdNote {
        return new StdNote(
            props.id,
            props.path,
            props.kind,
            props.tagIds,
            props.term,
            props.belongsTo,
            props.relatesTo,
            props.references,
        );
    }

    static create(props: CreateProps): StdNote {
        return new StdNote(
            StdNoteId.generate(),
            props.path,
            props.kind,
            props.tagIds,
            props.term,
            props.belongsTo,
            props.relatesTo,
            props.references,
        );
    }

    private get _name(): StdNoteName {
        return this._path.getNoteName();
    }

    isKindOf(kind: StdNoteKindValue): boolean {
        return this._kind.is(kind);
    }

    hasTag(tagId: TagId): boolean {
        return this._tagIds.has(tagId);
    }

    addTag(tagId: TagId): void {
        this._tagIds = this._tagIds.add(tagId);
    }

    removeTag(tagId: TagId): void {
        this._tagIds = this._tagIds.remove(tagId);
    }

    hasBelongsTo(noteId: StdNoteId): boolean {
        return this._belongsTo.has(noteId);
    }

    addBelongsTo(noteId: StdNoteId): void {
        this._belongsTo = this._belongsTo.add(noteId);
    }

    removeBelongsTo(noteId: StdNoteId): void {
        this._belongsTo = this._belongsTo.remove(noteId);
    }

    hasRelatesTo(noteId: StdNoteId): boolean {
        return this._relatesTo.has(noteId);
    }

    addRelatesTo(noteId: StdNoteId): void {
        this._relatesTo = this._relatesTo.add(noteId);
    }

    removeRelatesTo(noteId: StdNoteId): void {
        this._relatesTo = this._relatesTo.remove(noteId);
    }

    hasReference(noteId: StdNoteId): boolean {
        return this._references.has(noteId);
    }

    addReference(noteId: StdNoteId): void {
        this._references = this._references.add(noteId);
    }

    removeReference(noteId: StdNoteId): void {
        this._references = this._references.remove(noteId);
    }

    changeStartedAt(startedAt: DateTime): void {
        this._term = this._term.withStart(startedAt);
    }

    changeResolvedAt(resolvedAt: DateTime): void {
        this._term = this._term.withEnd(resolvedAt);
    }
}