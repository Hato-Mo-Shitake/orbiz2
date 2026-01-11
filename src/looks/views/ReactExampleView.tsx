import { ItemView, WorkspaceLeaf } from 'obsidian';
import { Root, createRoot } from 'react-dom/client';
import { ReactView } from '../components/ReactView';
import { AppContext } from '../context/AppContext';

export const VIEW_TYPE_REACT_EXAMPLE = 'react-example-view';

export class ReactExampleView extends ItemView {
    root: Root | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return VIEW_TYPE_REACT_EXAMPLE;
    }

    getDisplayText() {
        return 'Example view';
    }

    async onOpen() {
        this.root = createRoot(this.contentEl);
        this.root.render(
            // <StrictMode>
            <AppContext.Provider value={this.app}>
                <ReactView count={1} />
            </AppContext.Provider>
            // </StrictMode>
        );
    }

    async onClose() {
        this.root?.unmount();
    }
}