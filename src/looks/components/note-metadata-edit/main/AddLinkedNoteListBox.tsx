import { Notice } from "obsidian";
import { useState } from "react";
import { StdNote } from "src/core/domain/StdNote";
import { StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { useFmAttrEditor } from "src/looks/hooks/useFmAttrEditor";
import { LinkedNoteDirection, linkedNoteDirectionList } from "src/orbits/contracts/create-note";
import { FmKey } from "src/orbits/contracts/fmKey";
import { ReactSetState } from "src/orbits/contracts/react";
import { fmKeysForStdLinkedNoteList } from "src/orbits/schema/frontmatters/FmKey";
import { OOM } from "src/orbiz/managers/OrbizOrbManager";
import { AddLinkedNoteBox } from "../sub/AddLinkedNoteBox";

export function AddLinkedNoteListBox({
    linkedNoteIds,
    rootNoteOrb,
    options
}: {
    linkedNoteIds: string[],
    rootNoteOrb: StdNoteOrb
    options?: {
        resolve?: (isAdd: boolean) => void,
    }
}) {
    const fmOrb = rootNoteOrb.fmOrb;
    const [addCount, setAddCount] = useState(0);

    const linkedNoteOrbList: StdNoteOrb[] = linkedNoteIds.map(id => {
        return OOM().getStdNoteOrb({ noteId: id })!
    });

    const [inBelongsToInOrbs, setInBelongsToOrbs] = useState<StdNoteOrb[]>([]);
    const [inRelatesToOrbs, setInRelatesToOrbs] = useState<StdNoteOrb[]>([]);
    const [inReferencesOrbs, setInReferencesOrbs] = useState<StdNoteOrb[]>([]);
    const belongsTo = useFmAttrEditor<StdNote[]>(fmOrb.belongsTo, { showNotice: false });
    const relatesTo = useFmAttrEditor<StdNote[]>(fmOrb.relatesTo, { showNotice: false });
    const references = useFmAttrEditor<StdNote[]>(fmOrb.references, { showNotice: false });


    const linkedList: Record<FmKey<"stdLinkedNoteList">, {
        out: StdNote[] | null,
        in: StdNoteOrb[]
    }> = {
        "belongsTo": {
            "out": belongsTo.newValue,
            "in": inBelongsToInOrbs,
        },
        "relatesTo": {
            "out": relatesTo.newValue,
            "in": inRelatesToOrbs,
        },
        "references": {
            "out": references.newValue,
            "in": inReferencesOrbs
        }
    }

    const _addOut = (
        key: {
            newValue: StdNote[] | null,
            setNewValue: (newValue: StdNote[]) => void,
        },
        addNote: StdNote
    ) => {
        const values: StdNote[] = key.newValue || [];
        if (values.map(value => value.id).includes(addNote.id)) return;
        key.setNewValue([addNote, ...values]);
        setAddCount(count => count++);
    }

    const _addIn = (
        inOrbs: StdNoteOrb[],
        setInOrbs: ReactSetState<StdNoteOrb[]>,
        addNoteOrb: StdNoteOrb
    ) => {
        if (
            inOrbs.map(orb => orb.note.id).includes(addNoteOrb.note.id)
        ) return;

        setInOrbs([...inBelongsToInOrbs, addNoteOrb]);
        setAddCount(count => count++);
    }

    const handleAdd = (addNoteOrb: StdNoteOrb, key: FmKey<"stdLinkedNoteList">, direction: LinkedNoteDirection) => {
        switch (key) {
            case ("belongsTo"):
                switch (direction) {
                    case ("out"):
                        _addOut(belongsTo, addNoteOrb.note);
                        break;
                    case ("in"):
                        _addIn(inBelongsToInOrbs, setInBelongsToOrbs, addNoteOrb);
                        break;
                }
                break;
            case ("relatesTo"):

                switch (direction) {
                    case ("out"):
                        _addOut(relatesTo, addNoteOrb.note);
                        break;
                    case ("in"):
                        _addIn(inRelatesToOrbs, setInRelatesToOrbs, addNoteOrb);
                        break;
                }

                break;
            case ("references"):

                switch (direction) {
                    case ("out"):
                        _addOut(references, addNoteOrb.note);
                        break;
                    case ("in"):
                        _addIn(inReferencesOrbs, setInReferencesOrbs, addNoteOrb);
                        break;
                }
                break;
        }
    }

    const _deleteOut = (
        key: {
            newValue: StdNote[] | null,
            setNewValue: (newValue: StdNote[]) => void,
        },
        deleteNoteId: string,
    ) => {
        key.setNewValue(
            (key.newValue || []).filter(note => note.id !== deleteNoteId)
        );
        setAddCount(count => count--)
    }

    const _deleteIn = (
        setInOrbs: ReactSetState<StdNoteOrb[]>,
        deleteNoteId: string
    ) => {
        setInOrbs(
            orbs => orbs.filter(orb => orb.note.id !== deleteNoteId)
        )
        setAddCount(count => count--)
    }

    const handleDelete = (deleteNoteId: string, key: FmKey<"stdLinkedNoteList">, direction: LinkedNoteDirection) => {
        switch (key) {
            case ("belongsTo"):
                switch (direction) {
                    case ("out"):
                        _deleteOut(belongsTo, deleteNoteId);
                        break;
                    case ("in"):
                        _deleteIn(setInBelongsToOrbs, deleteNoteId);
                        break;
                }

                break;
            case ("relatesTo"):
                switch (direction) {
                    case ("out"):
                        _deleteOut(relatesTo, deleteNoteId);
                        break;
                    case ("in"):
                        _deleteIn(setInRelatesToOrbs, deleteNoteId)
                        break;
                }

                break;
            case ("references"):
                switch (direction) {
                    case ("out"):
                        _deleteOut(references, deleteNoteId);
                        break;
                    case ("in"):
                        _deleteIn(setInReferencesOrbs, deleteNoteId);
                        break;
                }
                break;
        }
    }
    const handleCommit = () => {
        belongsTo.handleCommit();
        relatesTo.handleCommit();
        references.handleCommit();

        inBelongsToInOrbs.forEach(orb => {
            orb.fmOrb.belongsTo.addNewAVal(rootNoteOrb.note);
            orb.fmOrb.belongsTo.commitNewValue();
        });

        inRelatesToOrbs.forEach(orb => {
            orb.fmOrb.relatesTo.addNewAVal(rootNoteOrb.note);
            orb.fmOrb.relatesTo.commitNewValue();
        });

        inReferencesOrbs.forEach(orb => {
            orb.fmOrb.references.addNewAVal(rootNoteOrb.note);
            orb.fmOrb.references.commitNewValue();
        });

        new Notice(`${rootNoteOrb.note.baseName} has been updated.`);
        options?.resolve?.(Boolean(addCount));
    }

    const labels: Record<FmKey<"stdLinkedNoteList">, Record<LinkedNoteDirection, string>> = {
        "belongsTo": {
            "out": "parent",
            "in": "child"
        },
        "relatesTo": {
            "out": "relatesTo",
            "in": "related",
        },
        "references": {
            "out": "reference",
            "in": "referenced"
        }
    }
    return (<>
        <h2>Add linked note?  For 「{rootNoteOrb.note.baseName}」</h2>
        <button onClick={handleCommit}>更新</button>
        <br />
        {linkedNoteOrbList.map(orb =>
            <div key={orb.note.id}>
                <AddLinkedNoteBox
                    linkedNoteOrb={orb}
                    onAdd={handleAdd}
                    labels={labels}
                />
            </div>
        )}

        <h3>current linked note list</h3>

        {fmKeysForStdLinkedNoteList.map(key =>
            [...linkedNoteDirectionList].reverse().map(d => {
                const noteList = d == "out"
                    ? linkedList[key].out || []
                    : linkedList[key].in.map(orb => orb.note);
                return (
                    <div key={`${key}-${d}`}>
                        {labels[key][d]}
                        <ul>
                            {noteList.map(note =>
                                <li key={note.id}>
                                    {note.baseName}
                                    {linkedNoteIds.includes(note.id) &&
                                        <button onClick={() => handleDelete(note.id, key, d)}>削除</button>
                                    }
                                </li>
                            )}
                        </ul>
                    </div>
                )
            })
        )}
    </>)
}