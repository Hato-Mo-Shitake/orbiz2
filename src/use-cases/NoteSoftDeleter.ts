import { MarkdownView, TFile } from "obsidian";
import { getCurrentYearMonth } from "src/assistance/utils/date";
import { PromptBoolModal } from "src/looks/modals/prompt/PromptBoolModal";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { ORM } from "src/orbiz/managers/OrbizRepositoryManager";

export class NoteSoftDeleter {
    // async trashNote(note: Note): Promise<string | null> {
    async trashNote(tFile: TFile): Promise<string | null> {
        const flag = await PromptBoolModal.get(`Are you sure you want to trash ${tFile.name}：   `);

        if (!flag) {
            return null;
        }

        const noteR = ORM().noteR;
        await noteR.upsertFmAttrs(tFile, {
            "oldPath": tFile.path,
            // "trashed": generateCurrentIsoDatetime(),
        });

        const trashDirPath = `____/trash/${OAM().rootDir}${getCurrentYearMonth()}`;
        const newName = `@Trashed@${tFile.name}`
        // console.log("newName", newName);

        const ws = OAM().app.workspace;
        const view = ws.getActiveViewOfType(MarkdownView);
        view?.leaf.detach();
        const newPath = await noteR.changeTFileDir(tFile, trashDirPath, { newFileName: newName });

        if (!newPath) {
            alert("trashing failed.");
            return null;
        }

        const leaf = ws.getLeaf();
        leaf.openFile(tFile);

        // TODO: 以下の処理は。OCM()のメソッドでやる。
        // OCM().noteSources.delete(note.fm.id.value);
        // OCM().fileNameToIdMap.delete(note.name);

        // 関連ノートのリンクも消さないとエラー出る。
        // フロントマターのkey名も変えて、リンクは消した方がいい。
        // キャッシュアップデータに任せるのがいいかな。。。
        // 関連リンクのことも考えると、結構コストかかる。
        // 関連リンクの削除は、ログもとって、ここでやるのが一番いいかな。
        // リンクさえ消せば、キャッシュの更新はキャッシュアップデーターが勝手にやってくれる？
        // でもキャッシュ丸ごと消えることを、アップデータが想定してないから。
        // 削除関連の処理は、ここで全部やるのがいいのかな？
        // マネージャからメソッドを呼んで、キャッシュ操作

        // TODO: ここでやるのは、削除後ログ用の新規フロントマターを追加するのみ。
        // それ以外の処理はOCMに任せる。
        // OCMは、削除するノートに関する全てのリンク情報を他ノートの内部にあるキャッシュも含めて断ち切ってから、対象のキャッシュを消す。

        return newPath;
    }
}