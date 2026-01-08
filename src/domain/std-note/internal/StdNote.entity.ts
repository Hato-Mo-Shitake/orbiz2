import { TagName } from "../../tag";

import { DateTimeTerm } from "../../common/DateTimeTerm.vo";
import { StdNoteId } from "./StdNoteId.vo";
import { StdNoteIdList } from "./StdNoteIdList.vo";
import { StdNoteKind } from "./StdNoteKind.vo";
import { StdNoteName } from "./StdNoteName.vo";
import { StdNotePath } from "./StdNotePath.vo";

type StdNoteBaseProps = {
    path: StdNotePath;
    kind: StdNoteKind;
    tags: TagName[];
    term: DateTimeTerm;
    outLinkStdNoteIds: StdNoteIdList;
    belongsTo: StdNoteIdList;
    relatesTo: StdNoteIdList;
    references: StdNoteIdList;
    optionalMetaDataList?: Partial<Record<string, unknown>>;
};

type ReconstructProps = StdNoteBaseProps & {
    id: StdNoteId;
};

type CreateProps = StdNoteBaseProps;

export class StdNote {
    private constructor(
        private readonly _id: StdNoteId,
        private _path: StdNotePath,
        private _kind: StdNoteKind,
        private readonly _tags: TagName[],
        private _term: DateTimeTerm,
        private readonly _outLinkStdNoteIds: StdNoteIdList,
        private readonly _belongsTo: StdNoteIdList,
        private readonly _relatesTo: StdNoteIdList,
        private readonly _references: StdNoteIdList,
        private readonly _optionalMetaDataList?: Partial<Record<string, unknown>>,
    ) {
        if (!_outLinkStdNoteIds.contains(_belongsTo)) {
            throw new Error("outLinkStdNoteIds must contains belongsTo.");
        }
        if (!_outLinkStdNoteIds.contains(_relatesTo)) {
            throw new Error("outLinkStdNoteIds must contains relatesTo.");
        }
        if (!_outLinkStdNoteIds.contains(_references)) {
            throw new Error("outLinkStdNoteIds must contains references.");
        }
    }

    static reconstruct(props: ReconstructProps): StdNote {
        return new StdNote(
            props.id,
            props.path,
            props.kind,
            [...props.tags],
            props.term,
            props.outLinkStdNoteIds,
            props.belongsTo,
            props.relatesTo,
            props.references,
            { ...props.optionalMetaDataList },
        );
    }

    static create(props: CreateProps): StdNote {
        return new StdNote(
            StdNoteId.generate(),
            props.path,
            props.kind,
            [...props.tags],
            props.term,
            props.outLinkStdNoteIds,
            props.belongsTo,
            props.relatesTo,
            props.references,
            { ...props.optionalMetaDataList },
        );
    }

    private get _name(): StdNoteName {
        return this._path.getNoteName();
    }
}