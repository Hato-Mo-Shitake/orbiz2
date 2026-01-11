import { ReactNode } from "react";

export function ItemList({
    list,
    keySlug,
    isHorizon = false,

}: {
    list: string[] | ReactNode[],
    keySlug: string
    isHorizon: boolean,
}) {
    let cnt = 0;
    return <ul
        className={isHorizon ? "orbiz__list--horizon" : ""}
        style={{ margin: "0", padding: "0" }}
    >
        {list.map(item =>
            <li key={`${cnt++}-${keySlug}`}>
                {item}
            </li>
        )}
    </ul>
}