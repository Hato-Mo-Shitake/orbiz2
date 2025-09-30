import { MarkdownView, Notice, Platform, TFile } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { StdNoteOrb } from "src/core/orb-system/orbs/NoteOrb";
import { NoteOrb } from "src/orbits/contracts/note-orb";
import { OEM } from "src/orbiz/managers/OrbizErrorManager";
import { OOM } from "src/orbiz/managers/OrbizOrbManager";

export const VIEW_TYPE_ORBIZ_MD = "orbiz-md-view";
export class OrbizMdView extends MarkdownView {
    root: Root | null = null;

    get noteOrb(): NoteOrb | null {
        const tFile = this.file;
        if (!tFile) return null;

        return OOM().getNoteOrb({ tFile });
    }



    getViewType(): string {
        // return "markdown";
        return VIEW_TYPE_ORBIZ_MD;
        // return Platform.isIosApp ? "markdown" : VIEW_TYPE_ORBIZ_MD;
    }

    onload(): void {
        super.onload();
    }

    reload() {
        if (Platform.isIosApp) {
            new Notice("ios APP!");
            return;
        }
        if (!this.root) return;
        this.root.render(
            // <StrictMode>
            <>
                {this.noteOrb?.viewer.getTopSection()}
            </>

            // </StrictMode>
        )
    }

    async onOpen(): Promise<void> {
        await super.onOpen();

        if (Platform.isIosApp) {
            new Notice("ios APP!そもそもマウントしてない。テスト中１");
            return;
        }
        new Notice("です。");


        // const metadataContainer = this.containerEl.querySelector(".metadata-container") as HTMLElement;
        // if (!metadataContainer) OEM.throwUnexpectedError();

        // const metadataContent = metadataContainer.querySelector(".metadata-content") as HTMLElement;
        // metadataContent.style.visibility = "hidden";

        // const metadataHeading = metadataContainer.querySelector(".metadata-properties-heading") as HTMLElement;
        // metadataHeading.style.visibility = "hidden";



        const cmContainer = this.containerEl.querySelector(".cm-content") as HTMLElement;
        if (!cmContainer) OEM.throwUnexpectedError();
        const tmpEl = document.createElement("div");
        cmContainer.insertAdjacentElement("afterbegin", tmpEl);
        // metadataContainer.appendChild(tmpEl);
        // metadataContainer.insertAdjacentElement("afterend", tmpEl);

        this.root = createRoot(tmpEl);
        // metadataContainer.style.display = "none";

        // tmpEl.addEventListener("focusin", (e) => {
        //     setTimeout(() => tmpEl.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
        // });
        // this.root = createRoot(metadataContent);
    }

    async onLoadFile(file: TFile): Promise<void> {
        await super.onLoadFile(file);

        if (Platform.isIosApp) {
            new Notice("ios APP!");
            return;
        }
        if (!this.root) return;
        this.root.render(
            // <StrictMode>
            <>
                {/* <div className="orbiz-note-top-section"
                // style={{
                //     position: "absolute",
                //     top: "0",
                //     left: "0",
                //     right: "0",
                // }}
                > */}
                {this.noteOrb?.viewer.getTopSection()}
                <div>テスト中6</div>
                {/* </div> */}
            </>

            // </StrictMode>
        );
        // })
    }

    async onUnloadFile(file: TFile): Promise<void> {
        await super.onUnloadFile(file);
    }

    onunload(): void {
        super.onunload();
    }

    protected async onClose(): Promise<void> {
        await super.onClose();
        this.root?.unmount();
    }
}

export interface StdNoteView extends OrbizMdView {
    noteOrb: StdNoteOrb | null;
}