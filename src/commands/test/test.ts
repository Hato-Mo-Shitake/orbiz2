import { GoogleGenAI } from "@google/genai";
import DOMPurify from "dompurify";
import { Command, TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { TFileFilter } from "src/assistance/helpers/TFileFilter";
import { getRandomFromArray } from "src/assistance/utils/array";
import { generateCurrentIsoDatetime } from "src/assistance/utils/date";
import { debugConsole } from "src/assistance/utils/debug";
import { sanitizeFileName } from "src/assistance/utils/filter";
import { FmDisplayModal } from "src/looks/modals/FmDisplayModal";
import { FmEditableModal } from "src/looks/modals/FmEditableModal";
import { FSuggestModal } from "src/looks/modals/FSuggestModal";
import { openModalMainMenu } from "src/looks/modals/SimpleDisplayModal";
import { VIEW_TYPE_EXAMPLE } from "src/looks/views/ExampleView";
import { logNoteTypeList, LogNoteTypeZEnum, myNoteTypeList, MyNoteTypeZEnum } from "src/orbits/schema/frontmatters/NoteType";
import { logNoteStatusList, LogNoteStatusZEnum } from "src/orbits/schema/frontmatters/Status";

const TestScript = {
    sanitize: () => {
        const text = `
    <div>
      <h1>Hello</h1>
      <img src="x" onerror="alert('XSS!')" />
      <a href="javascript:alert('Hacked!')">Click me</a>
      <p>Safe text</p>
      <script>alert('Executed!')</script>
    </div>
        `
        console.log("before", text);
        const purify = DOMPurify(window);
        console.log("after",
            purify.sanitize(text)
        );
    },
    execGoogleGeminiForTodayEvaluation: async () => {
        if (!AM.orbizSetting.enableGoogleGemini) {
            alert("unenable gemini");
            return;
        }
        // The client gets the API key from the environment variable `GEMINI_API_KEY`.
        const apiKey = AM.orbizSetting.googleGeminiApiKey;
        if (!apiKey) {
            alert("no api key");
            return;
        }

        const request = TestScript.generateRequestForGemini();
        const ai = new GoogleGenAI({ apiKey: apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: request,
        });


        const data = response.text?.replace(/@@(.*?)@@/g, (_, noteId) => {
            const note = AM.note.getStdNote({ noteId: noteId });
            if (!note) return `「error: note not found」`
            return note.internalLink;
        });
        if (!data) {
            alert("レスポンスが存在しません。");
            return;
        }
        AM.obsidian.vault.append(AM.diary.todayNoteOrb.note.tFile, `
<hr/>
<h1>Geminiによる本日の総評</h1>
${data}
`
        );
    },
    generateRequestForGemini: () => {
        const prompt = `
            末尾に示すJSONは、本日の私の活動を示したノート群（WhatIDidToday）と、これから実行する予定を示したノート群（nextSteps）の情報を持っています。
            これに対して、以下の注意事項を踏まえた上で、「本日の活動の評価」と「今後の活動に対するアドバイス・忠告・実行スケジュールの提案」を、必ず日本語で、返してください。
            - 各ノートは、uuidを元にしたnoteIdで識別されている。あなたも、「ノートの名称」をnoteIdとみなして回答しなければならない。回答に「ノートの名称」を用いる際は、「@@noteId（ここにuuidが入る）@@」のように@@で挟んで記述すること。
            - 各ノートは、以下のようなnoteTypeで判別する。回答に以下のnoteTypeを用いる場合は別名を用いずそのまま出力すること。（これらのnoteTypeは永続的に不変値）
                -- todo（todoリスト）
                -- schedule（今後の具体的スケジュール）
                -- notice（頭に入れておきたい系のメモ。リマインド的）
                -- plan（今後の計画。scheduleと違って目標的な意味合いが強い）
                -- memo（あらゆることに関するその他系メモ。一時的に保存し、あとでknowledgeなどにまとめ直す想定）
                -- knowledge（単純な知識・知見のノート）
                -- wip（work in progress 何かしらを創造する上での作業用・設計書用ノート）
                -- cretorium（創造に関するアレコレ。自分自身で考えた手法・アイデア等を蓄積する）
                -- gallery（あらゆる作品を置くノート。小説、漫画、映画、音楽、記事、などの情報を、自作他作問わずに置く）
                -- faq（遭遇した問題と、それを解決するまでを記録するノート）
            - whatIDidTodayにおける各値の意味は以下
                -- createdNoteIdsは、本日作成したnoteIdの配列
                -- modifiedNoteIdsは、本日編集したnoteIdの配列
                -- resolvedNoteIdsは、本日達成・解決したnoteIdの配列
            - nextStepsにおけるtodo, schedule, notice, plan, memo, wipにおいては、dueTimestampMs（解決達成目標期限）を特に意識した上で回答を行うこと。
            - あなたの回答は一度きりであることを前提に生成すること。次の私の回答を必要とするような余計な提案を行わないこと。
            - 余計なお世辞は生成せず、客観的な事実に基づき、淡々と評価すること。
            - 回答に「whatIDidToday」を用いる場合は「本日の解決・達成事項」と置き換えること。
            - 回答に「nextSteps」を用いる場合は「これから解決すべきノート」と置き換えること。
            - 回答に「dueTimestampMs」を用いる場合は「目標期限」と置き換えること。
            - 回答に、timestampの数値を用いる場合はそのまま出力せず、必ず日本時間の日付文字列に置き換えること。
        `;

        console.log(prompt);

        const genRequestJsonObj = () => {
            const todayFmOrb = AM.diary.todayNoteOrb.fmOrb;
            const requestObj: Record<string, any> = {
                "todayTimestampMs": AM.diary.todayMs,
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
                const fm = AM.obsidian.metadataCache.getFileCache(t)!.frontmatter!;
                return {
                    "noteType": fm["subType"],
                    "noteId": fm["id"],
                    "dueTimestampMs": fm["targetDate"] || "no due",
                };
            });

            return requestObj;
        }
        const requestJson = JSON.stringify(genRequestJsonObj());

        const request = `
${prompt}
${requestJson}
        `
        console.log("request", request);
        return request;
    },
    check: () => {
        debugConsole(
            AM.obsidian.app
        );
        debugConsole(
            AM.noteHistory.latestId
        );
    },
    checkUnresolvedLogNotes: () => {
        const logTFiles = AM.tFile.allLogTFiles;
        debugConsole(logTFiles);
        const unresolved = TFileFilter.extractUnresolvedLogNote(logTFiles);
        debugConsole(unresolved)
        debugConsole(
            unresolved.map(t => {
                const fm = AM.obsidian.metadataCache.getFileCache(t)?.frontmatter;
                return [
                    t.basename,
                    `resolved: ${fm?.["resolved"]}`,
                    `due: ${fm?.["due"]}`
                ]
            })
        );
    },
    checkNoteSource: () => {
        // @ts-ignore NOTE: テスト用
        const sources = AM.cache._noteSourceMapById;
        console.log("note sources: ", sources);
    },
    checkCachedStdNoteOrbs: () => {
        console.log(
            // @ts-ignore NOTE: テスト用
            AM.cache._stdNoteOrbMapById
        );
    },
    execGoogleGemini: async () => {
        if (!AM.orbizSetting.enableGoogleGemini) {
            alert("unenable gemini");
            return;
        }
        // The client gets the API key from the environment variable `GEMINI_API_KEY`.
        const apiKey = AM.orbizSetting.googleGeminiApiKey;
        if (!apiKey) {
            alert("no api key");
            return;
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "パンはパンでも食べられないパンダはワンダー――ーーーーーーー！！！！！",
        });
        console.log(response.text);
    },
    // checkTodayRecordNoteIds: () => {
    //     console.log("todayRecordNoteIds: ", AM.diary.todayRecordNoteIds);
    // },
    checkSettings: () => {
        // @ts-ignore NOTE: テスト用
        console.log(AM.orbizSetting._settings);
    },
    checkNoteIdHistory() {
        debugConsole(AM.noteHistory.getAllDesc());
        // console.log(ONhistoryM().getAllDesc());
    },
    setTagsAndInLinks: () => {
        const tFile = AM.tFile.activeTFile;
        if (!tFile) return;
        // const orb = AM.orb.getStdNoteOrb({ tFile });
        const orb = AM.orb.getStdNoteOrb({ tFile });
        if (!orb) return;
        orb.store.getState().setFmAttrTags(["かに", "せみ"]);
        orb.store.getState().setInLinkIds(["1", "2"]);
        // いけてそう！！！
    },
    openExampleView: async () => {
        AM.useCase.viewActivator.openNewView(VIEW_TYPE_EXAMPLE);
    },
    openCategoriesSetting: async () => {
        // CategoriesSettingModal.open();
    },

    openNoteSearchlight: async () => {
        // NoteSearchlightModal.open();
        // AM.useCase.viewActivator.openNewView(VIEW_TYPE_NOTE_SEARCHLIGHT);
    },
    openMainMenu: async () => {
        debugConsole("成功！2");
        openModalMainMenu();
        // SimpleDisplayModal.open(
        //     createMainMenuForModal
        // );
        // MainMenuModal.open();

        // AM.useCase.viewActivator.openNewView("main-menu-view");
    },
    openFmEditableModal: () => {
        const noteOrb = AM.orb.getActiveStdNoteOrb();
        if (!noteOrb) return;
        FmEditableModal.openNew(noteOrb.viewer);
    },
    openFmDisplayModal: () => {
        const noteOrb = AM.orb.getActiveStdNoteOrb();
        if (!noteOrb) return;
        FmDisplayModal.openNew(noteOrb.viewer);
    },
    openTodayNote: () => {
        const orb = AM.diary.todayNoteOrb;
        AM.looks.openNote(orb.note, false);
    },
    createDailyNote: () => {
        AM.useCase.noteCreator.createDailyNote();
    },
    createAutoStdNoteMany: async () => {
        const myList: string[] = [
            ...myNoteTypeList
        ];

        const logSubTypeList: string[] = [
            ...logNoteTypeList
        ];
        const statusList: string[] = [
            ...logNoteStatusList
        ];
        for (let i = 0; i < 10; i++) {
            const mySubType = getRandomFromArray(myList);
            await AM.useCase.noteCreator.createMyNote({
                baseName: sanitizeFileName(generateCurrentIsoDatetime() + "my" + i),
                subType: MyNoteTypeZEnum.parse(mySubType)
            });

            const logSubType = getRandomFromArray(logSubTypeList);
            const status = getRandomFromArray(statusList);
            await AM.useCase.noteCreator.createLogNote({
                baseName: sanitizeFileName(generateCurrentIsoDatetime() + "log" + + i),
                subType: LogNoteTypeZEnum.parse(logSubType),
                status: LogNoteStatusZEnum.parse(status)
            });
        }
    },
    createAutoMyNote: async () => {
        const list: string[] = [
            ...myNoteTypeList
        ];
        const subType = getRandomFromArray(list);
        await AM.useCase.noteCreator.createMyNote({
            baseName: sanitizeFileName(generateCurrentIsoDatetime()),
            subType: MyNoteTypeZEnum.parse(subType)
        });
        // AM.looks.openNote(orb.note, "split");
    },
    createAutoLogNote: async () => {
        const subTypeList: string[] = [
            ...logNoteTypeList
        ];
        const subType = getRandomFromArray(subTypeList);

        const statusList: string[] = [
            ...logNoteStatusList
        ];
        const status = getRandomFromArray(statusList);

        await AM.useCase.noteCreator.createLogNote({
            baseName: sanitizeFileName(generateCurrentIsoDatetime()),
            subType: LogNoteTypeZEnum.parse(subType),
            status: LogNoteStatusZEnum.parse(status)
        });
        // AM.looks.openNote(orb.note, "split");
    },
    softDeleteNote: () => {
        const tFile = AM.tFile.activeTFile;
        if (!tFile) return;
        AM.useCase.noteSoftDeleter.trashNote(tFile);
    },
    createMyNote: async () => {
        AM.useCase.prompt.createMyNote();
    },
    createLogNote: async () => {
        AM.useCase.prompt.createLogNote();
    },
    saveProgress: async () => {
        // OAM().OrbizPlugin.saveProgress();
        // AM.obsidian.OrbizPlugin.saveProgress();
        AM.orbiz.plugin.saveProgress();
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types
function makeTestCommands(scripts: Record<string, Function>): Record<string, { isEnabled: boolean, command: Command }> {
    const result: Record<string, { isEnabled: boolean, command: Command }> = {};

    Object.entries(scripts).forEach(([key, fn]) => {
        // key を "testXxx" 形式に変換
        const id = `test-${key.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}`;
        const commandName = key;

        const command: Command = {
            id,
            name: commandName,
            callback: async () => {
                await fn();
            }
        };

        result[`test${key[0].toUpperCase()}${key.slice(1)}`] = {
            isEnabled: true,
            command
        };
    });

    return result;
}
const TEST_COMMANDS = makeTestCommands(TestScript);

export const COMMAND_SELECT_TEST: Command = {
    id: "select-test-commands",
    name: "selectTestCommands",
    callback: async () => {
        const name = await FSuggestModal.getSelectedItem(
            Object.keys(TEST_COMMANDS)
        );

        const func = TEST_COMMANDS[name].command.callback;
        if (func === undefined) {
            alert("想定外のエラー");
            return;
        }

        func();
    }
}