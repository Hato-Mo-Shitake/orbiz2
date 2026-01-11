import { GoogleGenAI } from "@google/genai";
import DOMPurify from "dompurify";
import { TFile } from "obsidian";
import { ENV_GEMINI } from "src/_env/gemini";
import { getFmCache } from "src/assistance/aliaseFn/frontmatter";
import { TFileFilter } from "src/assistance/helpers/TFileFilter";
import { dateFormat } from "src/assistance/utils/date";
import { debugConsole } from "src/assistance/utils/debug";
import { DailyNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { logNoteTypeList, myNoteTypeList } from "src/orbits/schema/frontmatters/NoteType";
import { AM } from "../AppManager";

export class Gemini {
    async getResponseTodayClosingEvaluation(todayOrb: DailyNoteOrb): Promise<string> {
        if (!AM.orbizSetting.enableGoogleGemini) {
            alert("unenable gemini");
            throw new Error("unenable gemini");
        }
        // The client gets the API key from the environment variable `GEMINI_API_KEY`.
        const apiKey = AM.orbizSetting.googleGeminiApiKey;
        if (!apiKey) {
            alert("no api key");
            throw new Error("no api key gemini");
        }

        const request = this.generateRequestForTodayClosingEvaluation(todayOrb);
        debugConsole(request);
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: request,
        });

        //
        const purify = DOMPurify(window);
        return purify.sanitize(response.text || "");
    }

    private generateRequestForTodayClosingEvaluation(todayOrb: DailyNoteOrb) {
        const genRequestJsonObj = () => {
            const todayFmOrb = todayOrb.fmOrb;
            const requestObj: Record<string, any> = {
                "today": dateFormat(todayOrb.fmOrb.theDay.value, "Y-m-d_D"),
                "whatIDidToday": {},
                "nextSteps": {},
            };

            requestObj["whatIDidToday"]["createdNote"] = todayFmOrb.createdNotes.value.map(n => {
                return {
                    "noteType": n.fmCache["subType"],
                    "noteId": n.id
                };
            });
            requestObj["whatIDidToday"]["modifiedNote"] = todayFmOrb.modifiedNotes.value.map(n => {
                return {
                    "noteType": n.fmCache["subType"],
                    "noteId": n.id
                };
            });
            requestObj["whatIDidToday"]["resolvedNote"] = [...todayFmOrb.resolvedNotes.value, ...todayFmOrb.doneNotes.value].map(n => {
                return {
                    "noteType": n.fmCache["subType"],
                    "noteId": n.id
                };
            });

            const nextStepTFiles: TFile[] = [];

            logNoteTypeList.forEach(subType => {
                const tFiles = TFileFilter.extractUnresolvedLogNote(
                    AM.tFile.getAllLogTFilesForSubType(subType)
                );
                nextStepTFiles.push(...tFiles);
            });

            myNoteTypeList.forEach(subType => {
                const tFiles = TFileFilter.extractInProgressMyNote(
                    AM.tFile.getAllMyTFilesForSubType(subType)
                );
                nextStepTFiles.push(...tFiles);
            });

            requestObj["nextSteps"] = nextStepTFiles.map(t => {
                const fm = getFmCache(t)!;
                // const due = ("targetDate" in fm) ? fm["targetDate"] : null;
                const due = fm["type"] == "myNote" ? fm["targetDate"] : fm["due"];
                return {
                    "noteType": fm["subType"],
                    "noteId": fm["id"],
                    "due": due ? dateFormat(Number(due), "Y-m-d_D") : "no due",
                };
            });

            return requestObj;
        }
        const requestJson = JSON.stringify(genRequestJsonObj());

        const addPrompt = AM.orbizSetting.todayClosingEvaluationGoogleGeminiAdditionalPrompt;
        const request = `
${ENV_GEMINI.promptForTodayClosingEvaluation}
${addPrompt ? `次は付加の追加注意事項として捉えてください -> 「${addPrompt}」` : ""}
${requestJson}
        `
        return request;
    }
}