import { Editor } from "obsidian";

export type LineProcessor = (line: number, lineText: string) => void;
export function iterateNoteLines(editor: Editor, processor: LineProcessor) {
    const processLine = (line: number, lineText: string, editor: Editor) => {
        processor(line, lineText);
    }

    let isPassedFm = false;
    for (let i = 1; i < editor.lineCount(); i++) {
        const lineText = editor.getLine(i);
        if (isPassedFm) {
            processLine(i, lineText, editor)
        } else {
            if (lineText.includes("---")) {
                isPassedFm = true;
            }
        }
    }
}