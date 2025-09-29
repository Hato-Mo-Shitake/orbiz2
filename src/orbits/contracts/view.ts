import { VIEW_TYPE_EXAMPLE } from "src/looks/views/ExampleView";
import { VIEW_TYPE_ORBIZ_MD } from "src/looks/views/OrbizMdView";

// export const VIEW_TYPE_MAIN_MENU = 'main-menu-view';
const viewTypeList = [
    VIEW_TYPE_EXAMPLE,
    VIEW_TYPE_ORBIZ_MD
    // VIEW_TYPE_MY_NOTE,
    // VIEW_TYPE_LOG_NOTE,
    // VIEW_TYPE_NOTE_SEARCHLIGHT,
    // VIEW_TYPE_MAIN_MENU
] as const;
export type ViewType = typeof viewTypeList[number];