import { useState } from "react";

export function FoldingElement({
    header,
    hLevel = 5,
    children
}: {
    header: string,
    hLevel?: 1 | 2 | 3 | 4 | 5 | 6
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = useState(false);
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
                <span onClick={handleClick} >▼</span>
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