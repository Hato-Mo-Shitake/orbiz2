import { AM } from "src/app/AppManager";
import { BaseNote } from "src/core/domain/Note";
import { FmAttrEditor } from "src/orbits/contracts/fmAttr";
import { BaseFm } from "src/orbits/schema/frontmatters/fm";
import { BaseFmOrb } from "../../orbs/FmOrb";

export abstract class BaseNoteEditor<TFm extends BaseFm = BaseFm> {
    protected readonly fmEditors: FmAttrEditor[] = [];
    constructor(
        public readonly note: BaseNote<TFm>,
        public readonly fmOrb: BaseFmOrb
    ) {
        Object.values(fmOrb).forEach((editor: FmAttrEditor) => {
            if (editor.isImmutable) return;

            this.fmEditors.push(editor);
        })
    }

    async rename(newName: string) {
        AM.repository.noteR.renameTFile(this.note.tFile, newName);
    }

    async commitNewFm(): Promise<void> {
        const failedFmKeys: string[] = [];
        await this.fmEditors.forEach(editor => {
            try {
                if (!editor.commitNewValue) return;
                editor.commitNewValue();
            } catch (e) {
                failedFmKeys.push(editor.fmKey);
            }
        });
        if (failedFmKeys.length) {
            throw new Error(`validation error in commit. fmKeys: ${String(failedFmKeys)}. But other keys success.`);
        }
    }
}
