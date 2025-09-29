import { ExampleView, VIEW_TYPE_EXAMPLE } from "src/looks/views/ExampleView";
import { OrbizMdView, VIEW_TYPE_ORBIZ_MD } from "src/looks/views/OrbizMdView";
import { ReactExampleView, VIEW_TYPE_REACT_EXAMPLE } from "src/looks/views/ReactExampleView";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class ViewRegistrar {
    constructor() { }

    register(): void {
        const { myPlugin } = OAM();

        myPlugin.registerView(
            VIEW_TYPE_EXAMPLE,
            (leaf) => new ExampleView(leaf)
        );
        myPlugin.registerView(
            VIEW_TYPE_REACT_EXAMPLE,
            (leaf) => new ReactExampleView(leaf)
        );

        // TODO: ここでMarkdownViewを完全に上書きするのもあり？？？
        // できないかも。すでに存在するタイプだからエラー出る。

        // myPlugin.registerView(
        //     VIEW_TYPE_MY_NOTE,
        //     (leaf) => new MyNoteView(leaf)
        // );
        // myPlugin.registerView(
        //     VIEW_TYPE_LOG_NOTE,
        //     (leaf) => new LogNoteView(leaf)
        // );
        myPlugin.registerView(
            VIEW_TYPE_ORBIZ_MD,
            (leaf) => new OrbizMdView(leaf)
        )

        // myPlugin.registerView(
        //     VIEW_TYPE_NOTE_SEARCHLIGHT,
        //     (leaf) => new NoteSearchlightView(leaf)
        // );
        // myPlugin.registerView(
        //     VIEW_TYPE_MAIN_MENU,
        //     (leaf) => new MainMenuView(leaf)
        // );
    }
}