import { StdNote } from "src/core/domain/StdNote";
import { StdNoteReader } from "src/core/orb-system/services/readers/StdNoteReader";
import { LinkedNoteDirection } from "src/orbits/contracts/create-note";
import { FmKey } from "src/orbits/contracts/fmKey";
import { StdNoteState } from "src/orbits/schema/NoteState";
import { StoreApi, useStore } from "zustand";
import { NoteLinkTreeAbleList } from "../../common/NoteLinkTreeAbleList";

export function LinkedStdNoteDisplay({
    store,
    rootNote,
    fmKey,
    direction,
    header = "",
}: {
    store: StoreApi<StdNoteState>,
    rootNote: StdNote,
    fmKey: FmKey<"stdLinkedNoteList">,
    direction: LinkedNoteDirection,
    header?: string
}) {
    let ids: string[] = [];
    if (direction == "out") {
        ids = StdNoteReader.getOutLinkedNoteList(
            rootNote,
            fmKey,
            useStore(store, (s) => s.outLinkIds)
        ).map(n => n.id);
    } else if (direction == "in") {
        ids = StdNoteReader.getInLinkedNoteList(
            rootNote,
            fmKey,
            useStore(store, (s) => s.inLinkIds)
        ).map(n => n.id);
    }

    if (!ids.length) return null;


    // TODO: わかった。これ、outLinkIds全てをソースにしてるから、全部取ってきちゃってる。
    // 何があってもルートノートは必ず表示される仕様だからこんなことに。
    // ああ――ーーーわかった。




    // ここでidsをそれぞれのkeyに合うものに分けないといけない。
    // 自分自身も含めて表示すること前提のメソッドだから！！！ね。

    const noteTrees = ids.map(id => StdNoteReader.buildRecursiveStdNoteTree(
        id,
        fmKey,
        direction
    ))
    if (!noteTrees.length) return null;
    return (<>
        {header && <div>{header}: </div>}
        <NoteLinkTreeAbleList
            noteTrees={noteTrees}
        />
    </>)
}