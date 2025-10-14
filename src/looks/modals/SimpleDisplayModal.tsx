import { App, Modal } from "obsidian";
import * as React from "react";
import { ReactNode } from "react";
import { createRoot, Root } from "react-dom/client";
import { LogNoteType, MyNoteType } from "src/orbits/schema/frontmatters/NoteType";
import { OAM } from "src/orbiz/managers/OrbizAppManager";
import { MainMenu } from "../components/menu/MainMenu";
import { DailyNoteIndex } from "../components/menu/diary/DailyNoteIndex";
import { DailyNoteIndexByMonth } from "../components/menu/diary/DailyNoteIndexByMonth";
import { LogNoteIndex } from "../components/menu/log/LogNoteIndex";
import { LogNoteMenu } from "../components/menu/log/LogNoteMenu";
import { MyNoteIndex } from "../components/menu/my/MyNoteIndex";
import { MyNoteMenu } from "../components/menu/my/MyNoteMenu";
import { NoteSearchlight } from "../components/searchlights/NoteSearchlight";
import { CategoriesSetting } from "../components/settings/CategoriesSetting";
import { RoleKindsSetting } from "../components/settings/RoleKindsSetting";
import { SettingsIndex } from "../components/settings/SettingsIndex";

type CreateModalNode = (closeModal: () => void) => ReactNode;
export class SimpleDisplayModal extends Modal {
    static open(createNode: CreateModalNode) {
        const modal = new SimpleDisplayModal(OAM().app, createNode);
        modal.open();
    }

    root: Root | null = null;
    constructor(
        app: App,
        private readonly _createNode: CreateModalNode
    ) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        const ModalNode = this._createNode(() => this.close());

        this.root = createRoot(contentEl);
        this.root!.render(
            ModalNode
        );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}


type CloseModal = () => void;
export const changeModal = (closeModal: CloseModal, openModal: () => void) => {
    closeModal();
    openModal();
}

export function generateChangeModal(closeModal?: CloseModal) {
    return (openModal: () => void) => {
        closeModal?.();
        openModal();
    }
}
const openModal = (ModalNode: React.FC<{ closeModal: () => void }>) => {
    SimpleDisplayModal.open(
        (closeModal: CloseModal) => <ModalNode closeModal={closeModal} />
    );
}
export const openModalMainMenu = () => openModal(MainMenu)


export const openModalMyNoteMenu = () => openModal(MyNoteMenu)
export const openModalMyNoteIndex = (subType?: MyNoteType) => {
    SimpleDisplayModal.open(
        (closeModal: CloseModal) => <MyNoteIndex subType={subType} closeModal={closeModal} />
    );
}

// export const openModalLogNoteIndex = () => openModal(LogNoteIndex);
export const openModalLogNoteIndex = (subType?: LogNoteType) => {
    SimpleDisplayModal.open(
        (closeModal: CloseModal) => <LogNoteIndex subType={subType} closeModal={closeModal} />
    );
}
export const openModalLogNoteMenu = () => openModal(LogNoteMenu);



export const openModalDailyNoteIndex = () => openModal(DailyNoteIndex);
export const openModalDailyNoteIndexByMonth = (y: number, m: number) => {
    SimpleDisplayModal.open(
        (closeModal: CloseModal) => <DailyNoteIndexByMonth y={y} m={m} closeModal={closeModal} />
    );
}
export const openModalNoteSearchlight = () => openModal(NoteSearchlight);
export const openModalSettingsIndex = () => openModal(SettingsIndex);
export const openModalCategoriesSetting = () => openModal(CategoriesSetting);
export const openModalRoleKindsSetting = () => openModal(RoleKindsSetting)
