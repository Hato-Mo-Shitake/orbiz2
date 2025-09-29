import * as React from "react";
import { dateFormat } from "src/assistance/utils/date";
import { isMyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { NoteLink } from "src/looks/components/common/NoteLink";
import { LinkedNoteLinks, LinkedNoteLinkTree } from "src/looks/components/fm-view/DisplayLinkedNoteLinks";
import { FmKey } from "src/orbits/contracts/fmKey";
import { StdFm } from "src/orbits/schema/frontmatters/fm";
import { OTM } from "src/orbiz/managers/OrbizTFileManager";
import { OUM } from "src/orbiz/managers/OrbizUseCaseManager";
import { StdFmOrb } from "../../orbs/FmOrb";
import { StdNoteEditor } from "../editors/StdNoteEditor";
import { StdNoteReader } from "../readers/StdNoteReader";
import { BaseNoteViewer } from "./NoteViewer";

export abstract class StdNoteViewer<
    TFm extends StdFm = StdFm,
    TReader extends StdNoteReader<TFm> = StdNoteReader<TFm>,
    TEditor extends StdNoteEditor<TFm> = StdNoteEditor<TFm>,
> extends BaseNoteViewer<TFm, TReader, TEditor> {
    constructor(
        public readonly note: StdNote<TFm>,
        public readonly fmOrb: StdFmOrb,
        public readonly reader: TReader,
        public readonly editor: TEditor,
    ) {
        super(note, fmOrb, reader, editor);
    }

    getTopSection(): React.ReactNode {
        const created = this.note.created;
        const modified = this.note.modified;
        const cTFile = OTM().getDailyNoteTFile(created);
        const mTFile = OTM().getDailyNoteTFile(modified);
        return (<>
            <div style={{ marginBottom: "5px" }}>
                {super.getTopSection()}
                <div style={{ margin: "10px", display: "flex", alignItems: "center", gap: "0.2em" }}>
                    create:
                    <div style={{ margin: "10px", display: "flex", alignItems: "center", gap: "0.0em" }}>
                        <button style={{ backgroundColor: "skyblue" }} onClick={() => {
                            OUM().prompt.createMyNote({ rootNote: this.note });
                        }}>my</button>
                        {/* あとでなんとかします。。。。。 */}
                        {isMyNote(this.note) && <div>
                            <span>（</span>
                            <button style={{ backgroundColor: "skyblue", width: "6.1em", height: "1.5em" }} onClick={() => {
                                OUM().prompt.createRoleNode(this.note);
                            }}>role-node</button>
                            <span>）</span>
                        </div>}
                    </div>
                    <button
                        style={{ backgroundColor: "skyblue" }}
                        onClick={() => {
                            OUM().prompt.createLogNote({ rootNote: this.note });
                        }}>
                        log
                    </button>
                </div>
            </div>
            <hr />
            <div style={{ margin: "10px" }}>
                <span>
                    {"c: "}
                    {!cTFile ? <b>not found</b> :
                        <NoteLink
                            linkText={cTFile.path}
                            beginningPath={this.note.path}
                        >
                            {dateFormat(created, "Y-m-d_D")}
                        </NoteLink>
                    }
                </span>
                <span>{"　"}</span>
                <span>
                    {"m: "}
                    {!mTFile ? "not found" :
                        <NoteLink
                            linkText={mTFile.path}
                            beginningPath={this.note.path}
                        >
                            {dateFormat(modified, "Y-m-d_D")}
                        </NoteLink>
                    }
                </span>
            </div>
        </>)
    }

    getOutLinks(key: FmKey<"stdLinkedNoteList">): React.ReactNode {
        const ids = this.reader.getOutLinkIds(key);
        if (ids.length === 0) return null;

        return <LinkedNoteLinks
            ids={ids}
            rootNotePath={this.note.path}
        />
    }
    getInLinks(key: FmKey<"stdLinkedNoteList">): React.ReactNode {
        const ids = this.reader.getInLinkIds(key);
        if (ids.length === 0) return null;

        return <LinkedNoteLinks
            ids={ids}
            rootNotePath={this.note.path}
        />
    }
    getOutLinkTree(key: FmKey<"stdLinkedNoteList">): React.ReactNode {
        const idTrees = this.reader.getOutLinkTree(key);
        if (idTrees.length === 0) return null;

        return <LinkedNoteLinkTree
            idTrees={idTrees}
            rootNotePath={this.note.path}
        />
    }
    getInLinkTree(key: FmKey<"stdLinkedNoteList">): React.ReactNode {
        const idTrees = this.reader.getInLinkTree(key);
        if (idTrees.length === 0) return null;

        return <LinkedNoteLinkTree
            idTrees={idTrees}
            rootNotePath={this.note.path}
        />
    }
}