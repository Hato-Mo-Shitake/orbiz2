import { PaneType } from "obsidian";
import { MyNote } from "src/core/domain/MyNote";
import { StdNote } from "src/core/domain/StdNote";
import { PromptNewLogNoteConfModal } from "src/looks/modals/prompt/PromptNewLogNoteConfModal";
import { PromptNewMyNoteConfModal } from "src/looks/modals/prompt/PromptNewMyNoteConfModal";
import { PromptNewRoleNodeConfModal } from "src/looks/modals/prompt/PromptNewRoleNodeConfModal";
import { OUM } from "src/orbiz/managers/OrbizUseCaseManager";
import { OVM } from "src/orbiz/managers/OrbizViewManager";

export class Prompt {
    async createMyNote(options?: {
        newLeaf?: PaneType | boolean,
        rootNote?: StdNote
    }) {
        const conf = await PromptNewMyNoteConfModal.get(options);
        if (!conf) return;

        const orb = await OUM().noteCreator.createMyNote(conf);
        await OVM().openNote(orb.note, options?.newLeaf || "split");
    }

    async createRoleNode(
        roleHub: MyNote,
        options?: {
            newLeaf?: PaneType | boolean,
        }) {
        const conf = await PromptNewRoleNodeConfModal.get(roleHub);
        if (!conf) return;

        const orb = await OUM().noteCreator.createMyNote(conf);
        await OVM().openNote(orb.note, options?.newLeaf || "split");
    }

    async createLogNote(options?: {
        newLeaf?: PaneType | boolean,
        rootNote?: StdNote
    }) {
        const conf = await PromptNewLogNoteConfModal.get(options);
        if (!conf) return;

        const orb = await OUM().noteCreator.createLogNote(conf);
        await OVM().openNote(orb.note, options?.newLeaf || "split");
    }
}