import { Editor, EditorPosition, MarkdownFileInfo, MarkdownView } from "obsidian";
import { extractInternalLinks, extractNoteNameFromInternalLink } from "src/assistance/utils/link";
import { findSubstringRange } from "src/assistance/utils/string";
import { OCM } from "src/orbiz/managers/OrbizCacheManager";
import { OOM } from "src/orbiz/managers/OrbizOrbManager";

type UserEditAfterHandler = (editor: Editor) => void;
export class UserEditEventWatcher {
    private _editingTimers = new Map<string, number>();
    private readonly _doneTypingInterval = 5000;

    private readonly _callbackOnceAfterEdit = new Map<string, UserEditAfterHandler>();

    get isEdited(): boolean {
        return Boolean(this._editingTimers.size);
    }

    get editedNoteIds(): string[] {
        return Array.from(this._editingTimers.keys());
    }

    public watchOnceAfterEdit(noteId: string, callback: UserEditAfterHandler) {
        this._callbackOnceAfterEdit.set(noteId, callback);
    }

    // public watch

    userEdit(noteId: string, editor: Editor, info: MarkdownView | MarkdownFileInfo) {
        // console.log("入力！");



        // ここで内部リンクを検知して、ノートの名前を取得。
        // 存在確認を行なって、なければ作成の提案モーダルを出す。キャッシュの方で管理するのはやめる。
        // ノート名が <-todo->などで変わるようなら、以下の処理を使って、ノート名の書き換えも行う。


        // const result = findSubstringRange(currentLine, "[[エビ]]");
        // if (result) {


        //     const from: EditorPosition = { line: cLine, ch: result.start };
        //     const to: EditorPosition = { line: cLine, ch: result.end };

        //     // 入れ替え後の文字列に、元の文字列が入るとループするから注意
        //     // 書き換え後、内部リンクとして認識されないのが問題かも。
        //     // 新しく別の文字を入力するとなおる
        //     editor.replaceRange("[[エビデンス]]", from, to);
        //     // editor.refresh();
        //     // editor.undo();
        //     // editor.redo();

        //     // editor.setSelection(to, from);
        //     // editor.replaceSelection("しっぽ");
        //     // const changedLine = editor.getLine(cLine);
        //     // editor.setCursor({ line: cLine + 1, ch: 0 });
        //     editor.blur();
        //     alert("置き換えたよ。");
        // }




        const existingTimer = this._editingTimers.get(noteId);
        if (existingTimer) clearTimeout(existingTimer);


        const timerId = window.setTimeout(() => {
            // console.log("入力終了!");

            // createUnResolvedLinkNoteOrAddLinkedNoteAfterEditorChanged(noteId, editor);
            try {
                const cb = this._callbackOnceAfterEdit.get(noteId);
                if (cb) cb(editor);
            } finally {
                this._editingTimers.delete(noteId);
                this._callbackOnceAfterEdit.delete(noteId);
            }
        }, this._doneTypingInterval);

        this._editingTimers.set(noteId, timerId);
    }
}

function createUnResolvedLinkNoteOrAddLinkedNoteAfterEditorChanged(noteId: string, editor: Editor) {
    // debugConsole(editor.getValue(), editor.getLine(1), editor.getCursor());
    const c = editor.getCursor();
    // const cLine = c.line;
    // const cCh = 
    // debugConsole(c.line, c.ch);
    const currentLine = editor.getLine(c.line);
    // debugConsole(currentLine);

    if (currentLine.includes("<button>")) return;

    const iLinks = extractInternalLinks(currentLine);
    if (!iLinks.length) return;
    // debugConsole(iLinks);




    iLinks.forEach(il => {
        const result = findSubstringRange(currentLine, il);
        if (!result) return;
        const from: EditorPosition = { line: c.line, ch: result.start };
        const to: EditorPosition = { line: c.line, ch: result.end };



        const name = extractNoteNameFromInternalLink(il);
        if (!name) return;
        const targetId = OCM().getStdNoteIdByName(name);
        if (targetId) {
            const orb = OOM().getStdNoteOrb({ noteId: noteId });
            if (orb?.reader.linkedNoteIds.includes(targetId)) return;

            editor.replaceRange(`【@ ${il}  <button>かにボタン</button> @】`, from, to);
            editor.blur();
            // alert("関連ノートにない内部リンクが設置されました。:");
        } else {
            editor.replaceRange(`【@ ${il}  <button>かにボタン</button> @】`, from, to);
            editor.blur();
            // alert("未解決の内部リンクが設置されました。:");




            // 未解決リンクだけどさ、
            // Obsidianのデフォルト機能に則って、まっさらな新規作成ノートが作られた時に、そこに、メタ情報なりを設置したり、ディレクトリ移動するための、ボタンをおけばよくないか？
            // 新規ノートの作成場所を、tmpディレクトリ何なりにして
            // そっちの方が良くないか？？？
            // いやでも新規作成ノート側からすると、どこからリンクされているのか、どこから作成されたのかを判断するのが難しい

            // やっぱり、メタデータの更新時に判定を行なって、リンクの横にボタンを設置するのが一番いいかもしれないな。

            // 対象ノートのEditorを取得して、全文検索で、目的の[[ノート名]]文字列を見つける。

            // 【@ [[note-name]] <button>新規作成or関連に追加ボタン</button> <button>X</button> @】

        }
    });
}