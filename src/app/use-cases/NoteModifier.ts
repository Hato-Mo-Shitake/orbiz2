import { DailyNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { AM } from "../AppManager";

export class NoteModifier {
    private _headerGeminiTodayClosingEvaluation = `

---

<h1>Geminiによる本日の総評</h1>
    `;

    async appendGeminiTodayClosingEvaluation(todayOrb: DailyNoteOrb) {
        const responseText = await AM.useCase.gemini.getResponseTodayClosingEvaluation(todayOrb);

        const data = responseText.replace(/@@(.*?)@@/g, (_, noteId) => {
            const note = AM.note.getStdNote({ noteId: noteId });
            if (!note) return `「error: note not found. id: ${noteId}」`
            return note.internalLink;
        });
        if (!data) throw new Error("no google gemini response in appendGeminiTodayClosingEvaluation");

        const appendText = `
${this._headerGeminiTodayClosingEvaluation}
${data}
        `;

        await AM.obsidian.vault.append(todayOrb.note.tFile, appendText);
    }
}