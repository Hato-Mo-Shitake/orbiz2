import { PaneType, Platform, TFile } from "obsidian";
import { AM } from "src/app/AppManager";
import { isMyNote, MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { UnexpectedError } from "src/errors/UnexpectedError";
import { PromptNewLogNoteConfModal } from "src/looks/modals/prompt/PromptNewLogNoteConfModal";
import { PromptNewMyNoteConfModal } from "src/looks/modals/prompt/PromptNewMyNoteConfModal";
import { PromptNewRoleNodeConfModal } from "src/looks/modals/prompt/PromptNewRoleNodeConfModal";
import { PromptSelectModal } from "src/looks/modals/prompt/PromptSelectModal";
import { LinkedNoteDirection } from "src/orbits/contracts/create-note";
import { FmKey } from "src/orbits/contracts/fmKey";
import { isMyNoteType } from "src/orbits/schema/frontmatters/NoteType";

export class Prompt {
    async selectFromList<T = string>(list: T[] | { value: T, label: string }[], title = "select"): Promise<T | null> {
        const _list = list as any;
        if (typeof _list[0]["label"] === "string") {
            const list = _list as { value: T, label: string }[];
            return await PromptSelectModal.get(title, list);
        } else {
            const list = _list as T[];

            return await PromptSelectModal.get(title,
                list.map(l => ({ value: l, label: String(l) }))
            );
        }
    }

    async adaptTFileToNote(tFile: TFile, rootNote: StdNote) {
        const typeList = ["my", "log"];
        if (isMyNoteType(rootNote.fmCache["subType"])) {
            typeList.push("roleNode");
        }
        const selected = await AM.useCase.prompt.selectFromList(typeList, "select note type to create");

        switch (selected) {
            case ("my"):
                await AM.useCase.prompt.createMyNote({ rootNote: rootNote, tFile: tFile, newLeaf: false });
                break;
            case ("log"):
                await AM.useCase.prompt.createLogNote({ rootNote: rootNote, tFile: tFile, newLeaf: false });
                break;
            case ("roleNode"):
                if (!isMyNote(rootNote)) {
                    alert("role node is MyNote only.");
                    break;
                }
                await AM.useCase.prompt.createRoleNode(rootNote, { tFile: tFile, newLeaf: false });
                break;
            default:
                throw new UnexpectedError();
        }
    }

    async addLinkedNote(unlinkedNote: StdNote, rootNote: StdNote): Promise<boolean> {
        const list: { value: [LinkedNoteDirection, FmKey<"stdLinkedNoteList">], label: string }[]
            = [
                { value: ["out", "belongsTo"], label: "patent" },
                { value: ["in", "belongsTo"], label: "child" },
                { value: ["out", "relatesTo"], label: "relative elder" },
                { value: ["in", "relatesTo"], label: "relative child" },
                { value: ["out", "references"], label: "reference" },
                { value: ["in", "references"], label: "referenced" },
            ];

        const selected = await AM.useCase.prompt.selectFromList<[LinkedNoteDirection, FmKey<"stdLinkedNoteList">]>(
            list,
            `add linked-note: 「${unlinkedNote.baseName}」\n for 「${rootNote.baseName}」`
        );

        if (!selected) {
            return false;
        }
        const [d, key] = selected;

        switch (d) {
            case ("out"):
                (await AM.orb.getStdNoteOrb({ note: rootNote })!.editor.addLinkedNote(unlinkedNote, key)).commitNewFm();
                break;
            case ("in"):
                (await AM.orb.getStdNoteOrb({ note: unlinkedNote })!.editor.addLinkedNote(rootNote, key)).commitNewFm();
                break;
            default:
                throw new UnexpectedError();
        }

        alert("link success");
        return true;
    }

    async createMyNote(options?: {
        newLeaf?: PaneType | boolean,
        rootNote?: StdNote,
        tFile?: TFile
    }): Promise<StdNoteOrb | null> {
        const conf = await PromptNewMyNoteConfModal.get({
            rootNote: options?.rootNote,
            baseName: options?.tFile?.basename
        });
        if (!conf) return null;

        const orb = await AM.useCase.noteCreator.createMyNote(conf, { tFile: options?.tFile });
        if (!options?.newLeaf || Platform.isMobileApp) {
            await AM.looks.openNote(orb.note);
        } else {
            await AM.looks.openNote(orb.note, options?.newLeaf || "split");
        }
        return orb;
    }

    async createRoleNode(
        roleHub: MyNote,
        options?: {
            newLeaf?: PaneType | boolean,
            tFile?: TFile
        }): Promise<StdNoteOrb | null> {
        const conf = await PromptNewRoleNodeConfModal.get(roleHub);
        if (!conf) return null;

        const orb = await AM.useCase.noteCreator.createMyNote(conf, { tFile: options?.tFile });

        if (!options?.newLeaf || Platform.isMobileApp) {
            await AM.looks.openNote(orb.note);
        } else {
            await AM.looks.openNote(orb.note, options?.newLeaf || "split");
        }

        return orb;
    }

    async createLogNote(options?: {
        newLeaf?: PaneType | boolean,
        rootNote?: StdNote,
        tFile?: TFile
    }): Promise<StdNoteOrb | null> {
        const conf = await PromptNewLogNoteConfModal.get({
            rootNote: options?.rootNote,
            baseName: options?.tFile?.basename
        });
        if (!conf) return null;

        const orb = await AM.useCase.noteCreator.createLogNote(conf, { tFile: options?.tFile });

        if (!options?.newLeaf || Platform.isMobileApp) {
            await AM.looks.openNote(orb.note);
        } else {
            await AM.looks.openNote(orb.note, options?.newLeaf || "split");
        }

        return orb;
    }
}