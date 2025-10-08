import { useState } from "react";

export function FoldingElement({
    header,
    hLevel = 5,
    children,
    defaultOpen = false
}: {
    header: string,
    hLevel?: 1 | 2 | 3 | 4 | 5 | 6
    children: React.ReactNode,
    defaultOpen?: boolean
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const handleClick = () => {
        if (isOpen) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }

    const headerEl = (level: number) => {
        const style: React.CSSProperties = {
            display: "flex",
            gap: "0.5em"
        }
        const tags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
        const Tag = tags[level - 1];
        return (<>
            <Tag style={style}>
                <span onClick={handleClick} >{isOpen ? "▼" : "▶︎"}</span>
                {header}
            </Tag>
        </>);
    }

    return (<>
        {headerEl(hLevel)}
        <div>
            {isOpen && children}
        </div>
    </>)
}