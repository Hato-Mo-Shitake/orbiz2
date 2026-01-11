import { VIEW_TYPE_EXAMPLE } from "src/looks/views/ExampleView";

const viewTypeList = [
    VIEW_TYPE_EXAMPLE,
] as const;
export type ViewType = typeof viewTypeList[number];