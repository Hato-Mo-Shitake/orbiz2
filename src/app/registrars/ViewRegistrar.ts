import { ExampleView, VIEW_TYPE_EXAMPLE } from "src/looks/views/ExampleView";
import { ReactExampleView, VIEW_TYPE_REACT_EXAMPLE } from "src/looks/views/ReactExampleView";
import { AM } from "../AppManager";

export class ViewRegistrar {
    register(): void {
        const { plugin } = AM.orbiz;

        plugin.registerView(
            VIEW_TYPE_EXAMPLE,
            (leaf) => new ExampleView(leaf)
        );
        plugin.registerView(
            VIEW_TYPE_REACT_EXAMPLE,
            (leaf) => new ReactExampleView(leaf)
        );
    }
}