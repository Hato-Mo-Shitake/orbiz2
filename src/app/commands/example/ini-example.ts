import { Command, Editor, MarkdownView } from "obsidian";
import { SampleModal } from "src/looks/modals/SampleModal";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

const OpenSampleModalSimpleCommand = {
    id: 'open-sample-modal-simple',
    name: 'Open sample modal (simple)',
    callback: () => {
        new SampleModal(OAM().myPlugin.app).open();
    }
}

const SampleEditorCommand = {
    id: 'sample-editor-command',
    name: 'Sample editor command',
    editorCallback: (editor: Editor, view: MarkdownView) => {
        console.log(editor.getSelection());
        editor.replaceSelection('Sample Editor Command');
    }
};

const OpenSampleModalComplexCommand = {
    id: 'open-sample-modal-complex',
    name: 'Open sample modal (complex)',
    checkCallback: (checking: boolean) => {
        // Conditions to check
        const markdownView = OAM().app.workspace.getActiveViewOfType(MarkdownView);
        if (markdownView) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            if (!checking) {
                new SampleModal(OAM().app).open();
            }

            // This command will only show up in Command Palette when the check function returns true
            return true;
        }
    }
};

export const COMMAND_LIST_INI_EXAMPLE: Command[] = [
    OpenSampleModalSimpleCommand,
    SampleEditorCommand,
    OpenSampleModalComplexCommand
];