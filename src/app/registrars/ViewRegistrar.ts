import { ExampleView, VIEW_TYPE_EXAMPLE } from "src/looks/views/ExampleView";
import { ReactExampleView, VIEW_TYPE_REACT_EXAMPLE } from "src/looks/views/ReactExampleView";
import { OAM } from "src/orbiz/managers/OrbizAppManager";

export class ViewRegistrar {
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
    }
}